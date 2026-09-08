-- Supabase migration history version: 20260907041839.
create or replace function public.load_financial_evolution_buckets(
  p_start_on date,
  p_end_on date,
  p_bucket text
)
returns table (
  account_count bigint,
  start_on_inclusive date,
  end_on_exclusive date,
  open_in_cents numeric,
  high_in_cents numeric,
  low_in_cents numeric,
  close_in_cents numeric,
  income_in_cents numeric,
  expense_in_cents numeric,
  volume_in_cents numeric,
  transaction_count bigint
)
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  current_user_id uuid := (select auth.uid());
  is_anonymous_user boolean := coalesce(
    ((select auth.jwt()) ->> 'is_anonymous')::boolean,
    false
  );
  bucket_step interval;
  first_bucket_start timestamp;
  last_bucket_start timestamp;
  bucket_count bigint;
begin
  if p_start_on is null or p_end_on is null then
    raise exception using
      errcode = '22023',
      message = 'financial evolution bucket boundaries are required';
  end if;

  if p_start_on >= p_end_on then
    raise exception using
      errcode = '22023',
      message = 'financial evolution bucket boundaries are invalid';
  end if;

  if p_end_on - p_start_on > 366 then
    raise exception using
      errcode = '22023',
      message = 'financial evolution bucket interval exceeds 366 days';
  end if;

  bucket_step := case p_bucket
    when 'week' then interval '1 week'
    when 'month' then interval '1 month'
    else null
  end;

  if bucket_step is null then
    raise exception using
      errcode = '22023',
      message = 'financial evolution bucket is invalid';
  end if;

  if current_user_id is null or is_anonymous_user then
    raise exception using
      errcode = '42501',
      message = 'financial evolution is unavailable';
  end if;

  first_bucket_start := pg_catalog.date_trunc(p_bucket, p_start_on::timestamp);
  last_bucket_start := pg_catalog.date_trunc(
    p_bucket,
    (p_end_on - 1)::timestamp
  );

  select count(*)::bigint
  into bucket_count
  from pg_catalog.generate_series(
    first_bucket_start,
    last_bucket_start,
    bucket_step
  );

  if bucket_count > 60 then
    raise exception using
      errcode = '22023',
      message = 'financial evolution bucket count exceeds 60';
  end if;

  return query
  with account_snapshot as (
    select
      count(*)::bigint as owned_account_count,
      coalesce(sum(account.initial_balance_in_cents), 0)::numeric
        as initial_balance_total
    from public.financial_accounts as account
    where account.user_id = current_user_id
  ),
  prior_movement_snapshot as (
    select
      coalesce(
        sum(
          case movement.type
            when 'income' then movement.amount_in_cents
            when 'expense' then -movement.amount_in_cents
          end
        ),
        0
      )::numeric as prior_net_total
    from public.transactions as movement
    where movement.user_id = current_user_id
      and movement.occurred_on < p_start_on
  ),
  opening_snapshot as (
    select
      account.owned_account_count,
      account.initial_balance_total + prior.prior_net_total
        as opening_balance_in_cents
    from account_snapshot as account
    cross join prior_movement_snapshot as prior
  ),
  period_movements as (
    select
      movement.id,
      movement.occurred_on,
      movement.created_at,
      movement.type,
      movement.amount_in_cents,
      case movement.type
        when 'income' then movement.amount_in_cents
        when 'expense' then -movement.amount_in_cents
      end::numeric as signed_amount_in_cents,
      opening.opening_balance_in_cents + sum(
        case movement.type
          when 'income' then movement.amount_in_cents
          when 'expense' then -movement.amount_in_cents
        end
      ) over (
        order by movement.occurred_on, movement.created_at, movement.id
        rows between unbounded preceding and current row
      ) as balance_after_in_cents
    from public.transactions as movement
    cross join opening_snapshot as opening
    where movement.user_id = current_user_id
      and movement.occurred_on >= p_start_on
      and movement.occurred_on < p_end_on
  ),
  bucket_boundaries as (
    select
      greatest(p_start_on, series.bucket_start::date)
        as bucket_start_on,
      least(
        p_end_on,
        (series.bucket_start + bucket_step)::date
      ) as bucket_end_on
    from pg_catalog.generate_series(
      first_bucket_start,
      last_bucket_start,
      bucket_step
    ) as series(bucket_start)
  ),
  bucket_totals as (
    select
      boundary.bucket_start_on,
      boundary.bucket_end_on,
      opening.owned_account_count,
      opening.opening_balance_in_cents + coalesce(
        sum(movement.signed_amount_in_cents) filter (
          where movement.occurred_on < boundary.bucket_start_on
        ),
        0
      ) as bucket_open_in_cents,
      coalesce(
        sum(movement.amount_in_cents) filter (
          where movement.occurred_on >= boundary.bucket_start_on
            and movement.type = 'income'
        ),
        0
      )::numeric as bucket_income_in_cents,
      coalesce(
        sum(movement.amount_in_cents) filter (
          where movement.occurred_on >= boundary.bucket_start_on
            and movement.type = 'expense'
        ),
        0
      )::numeric as bucket_expense_in_cents,
      count(movement.id) filter (
        where movement.occurred_on >= boundary.bucket_start_on
      )::bigint as bucket_transaction_count
    from bucket_boundaries as boundary
    cross join opening_snapshot as opening
    left join period_movements as movement
      on movement.occurred_on < boundary.bucket_end_on
    group by
      boundary.bucket_start_on,
      boundary.bucket_end_on,
      opening.owned_account_count,
      opening.opening_balance_in_cents
  )
  select
    total.owned_account_count,
    total.bucket_start_on,
    total.bucket_end_on,
    total.bucket_open_in_cents,
    greatest(
      total.bucket_open_in_cents,
      coalesce(
        max(movement.balance_after_in_cents),
        total.bucket_open_in_cents
      )
    ),
    least(
      total.bucket_open_in_cents,
      coalesce(
        min(movement.balance_after_in_cents),
        total.bucket_open_in_cents
      )
    ),
    total.bucket_open_in_cents
      + total.bucket_income_in_cents
      - total.bucket_expense_in_cents,
    total.bucket_income_in_cents,
    total.bucket_expense_in_cents,
    total.bucket_income_in_cents + total.bucket_expense_in_cents,
    total.bucket_transaction_count
  from bucket_totals as total
  left join period_movements as movement
    on movement.occurred_on >= total.bucket_start_on
   and movement.occurred_on < total.bucket_end_on
  group by
    total.bucket_start_on,
    total.bucket_end_on,
    total.owned_account_count,
    total.bucket_open_in_cents,
    total.bucket_income_in_cents,
    total.bucket_expense_in_cents,
    total.bucket_transaction_count
  order by total.bucket_start_on;
end;
$function$;

revoke all on function public.load_financial_evolution_buckets(date, date, text)
  from PUBLIC, anon, authenticated, service_role;
grant execute on function public.load_financial_evolution_buckets(date, date, text)
  to authenticated;

notify pgrst, 'reload schema';
