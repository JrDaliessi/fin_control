begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;
set local enable_seqscan = off;

select plan(4);

select set_config('test.history_plan_user_id', gen_random_uuid()::text, true);

insert into auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data,
  is_anonymous, created_at, updated_at
)
values (
  current_setting('test.history_plan_user_id')::uuid,
  'authenticated',
  'authenticated',
  current_setting('test.history_plan_user_id') || '@example.invalid',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  now(),
  now()
);

select set_config('request.jwt.claim.sub', current_setting('test.history_plan_user_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.history_plan_user_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

create temporary table history_start_plan (line text) on commit drop;

do $performance$
declare
  plan_line text;
begin
  for plan_line in execute $query$
    explain (analyze, buffers, format text)
    select min(occurred_on)
    from public.transactions
    where user_id = (select auth.uid())
  $query$
  loop
    insert into history_start_plan values (plan_line);
  end loop;
end
$performance$;

select ok(
  (select string_agg(line, E'\n') from history_start_plan)
    like '%transactions_user_occurred_created_id_idx%',
  'history lookup uses the existing owner and occurrence-date index'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'transactions'
      and indexname = 'transactions_user_occurred_created_id_idx'
  ),
  'required composite transaction index already exists'
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

select is(
  (
    select count(*)
    from pg_indexes
    where schemaname = 'public'
      and indexname like 'financial_history_start%'
  ),
  0::bigint,
  'performance contract introduces no speculative feature index'
);

reset role;
select * from finish();
rollback;
