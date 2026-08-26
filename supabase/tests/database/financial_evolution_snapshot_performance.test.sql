begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;
set local enable_seqscan = off;

select plan(4);

select set_config('test.analytics_user_id', gen_random_uuid()::text, true);

insert into auth.users (
  id,
  aud,
  role,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  is_anonymous,
  created_at,
  updated_at
)
values (
  current_setting('test.analytics_user_id')::uuid,
  'authenticated',
  'authenticated',
  current_setting('test.analytics_user_id') || '@example.invalid',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  now(),
  now()
);

insert into public.financial_accounts (
  user_id,
  name,
  type,
  initial_balance_in_cents
)
values (
  current_setting('test.analytics_user_id')::uuid,
  'Conta de plano',
  'checking',
  1000
);

insert into public.categories (user_id, name, kind)
values (
  current_setting('test.analytics_user_id')::uuid,
  'Categoria de plano',
  'income'
);

insert into public.transactions (
  user_id,
  account_id,
  category_id,
  description,
  amount_in_cents,
  type,
  occurred_on
)
select
  current_setting('test.analytics_user_id')::uuid,
  account.id,
  category.id,
  'Movimento de plano',
  100,
  'income',
  date '2026-03-01'
from public.financial_accounts as account
join public.categories as category
  on category.user_id = account.user_id
 and category.kind = 'income'
where account.user_id = current_setting('test.analytics_user_id')::uuid;

select set_config('request.jwt.claim.sub', current_setting('test.analytics_user_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.analytics_user_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

create temporary table analytics_interval_plan (line text) on commit drop;
create temporary table analytics_opening_plan (line text) on commit drop;

do $performance$
declare
  plan_line text;
begin
  for plan_line in execute $query$
    explain (analyze, buffers, format text)
    select id, occurred_on, created_at, type, amount_in_cents
    from public.transactions
    where user_id = (select auth.uid())
      and occurred_on >= date '2026-03-01'
      and occurred_on < date '2026-03-08'
    order by occurred_on, created_at, id
  $query$
  loop
    insert into analytics_interval_plan values (plan_line);
  end loop;

  for plan_line in execute $query$
    explain (analyze, buffers, format text)
    select coalesce(sum(initial_balance_in_cents), 0)
    from public.financial_accounts
    where user_id = (select auth.uid())
  $query$
  loop
    insert into analytics_opening_plan values (plan_line);
  end loop;
end
$performance$;

select like(
  (select string_agg(line, E'\n') from analytics_interval_plan),
  '%transactions_user_occurred_created_id_idx%',
  'interval query uses the existing owner and civil-date index'
);

select like(
  (select string_agg(line, E'\n') from analytics_opening_plan),
  '%financial_accounts_user_created_id_idx%',
  'opening account query uses the existing owner index'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'transactions'
      and policyname = 'transactions_select_own'
      and qual ~ '\( SELECT auth\.uid\(\) AS uid\)'
      and qual ~ '\( SELECT auth\.jwt\(\) AS jwt\)'
  ),
  'transaction RLS helpers remain cached per statement'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and policyname = 'financial_accounts_select_own'
      and qual ~ '\( SELECT auth\.uid\(\) AS uid\)'
      and qual ~ '\( SELECT auth\.jwt\(\) AS jwt\)'
  ),
  'account RLS helpers remain cached per statement'
);

reset role;
select * from finish();
rollback;
