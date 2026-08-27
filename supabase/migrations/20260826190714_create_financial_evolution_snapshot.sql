-- Supabase migration history version: 20260826190714.
create or replace function public.load_financial_evolution_snapshot(
  p_start_on date,
  p_end_on date
)
returns table (
  account_count bigint,
  opening_balance_in_cents numeric,
  movement_id uuid,
  occurred_on date,
  created_at timestamptz,
  movement_type text,
  amount_in_cents bigint
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
begin
  if p_start_on is null or p_end_on is null then
    raise exception using
      errcode = '22023',
      message = 'financial evolution boundaries are required';
  end if;

  if p_start_on >= p_end_on then
    raise exception using
      errcode = '22023',
      message = 'financial evolution boundaries are invalid';
  end if;

  if p_end_on - p_start_on > 31 then
    raise exception using
      errcode = '22023',
      message = 'financial evolution interval exceeds 31 days';
  end if;

  if current_user_id is null or is_anonymous_user then
    raise exception using
      errcode = '42501',
      message = 'financial evolution is unavailable';
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
  )
  select
    account.owned_account_count,
    account.initial_balance_total + prior.prior_net_total,
    movement.id,
    movement.occurred_on,
    movement.created_at,
    movement.type,
    movement.amount_in_cents
  from account_snapshot as account
  cross join prior_movement_snapshot as prior
  left join public.transactions as movement
    on movement.user_id = current_user_id
   and movement.occurred_on >= p_start_on
   and movement.occurred_on < p_end_on
  order by movement.occurred_on, movement.created_at, movement.id;
end;
$function$;

revoke all on function public.load_financial_evolution_snapshot(date, date)
  from PUBLIC, anon, authenticated, service_role;
grant execute on function public.load_financial_evolution_snapshot(date, date)
  to authenticated;

notify pgrst, 'reload schema';
