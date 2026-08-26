begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(14);

select set_config('test.user_a_id', gen_random_uuid()::text, true);
select set_config('test.user_b_id', gen_random_uuid()::text, true);
select set_config('test.user_c_id', gen_random_uuid()::text, true);
select set_config('test.anonymous_user_id', gen_random_uuid()::text, true);

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
select
  id,
  'authenticated',
  'authenticated',
  id::text || '@example.invalid',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  is_anonymous,
  now(),
  now()
from (
  values
    (current_setting('test.user_a_id')::uuid, false),
    (current_setting('test.user_b_id')::uuid, false),
    (current_setting('test.user_c_id')::uuid, false),
    (current_setting('test.anonymous_user_id')::uuid, true)
) as fixture(id, is_anonymous);

insert into public.financial_accounts (
  user_id,
  name,
  type,
  initial_balance_in_cents
)
values
  (current_setting('test.user_a_id')::uuid, 'Conta A 1', 'checking', 10000),
  (current_setting('test.user_a_id')::uuid, 'Conta A 2', 'savings', -2000),
  (current_setting('test.user_b_id')::uuid, 'Conta B', 'checking', 4000),
  (current_setting('test.anonymous_user_id')::uuid, 'Conta anônima', 'checking', 9000);

insert into public.categories (user_id, name, kind)
select id, 'Receitas ' || id::text, 'income'
from (
  values
    (current_setting('test.user_a_id')::uuid),
    (current_setting('test.user_b_id')::uuid),
    (current_setting('test.anonymous_user_id')::uuid)
) as fixture(id);

insert into public.categories (user_id, name, kind)
select id, 'Despesas ' || id::text, 'expense'
from (
  values
    (current_setting('test.user_a_id')::uuid),
    (current_setting('test.user_b_id')::uuid),
    (current_setting('test.anonymous_user_id')::uuid)
) as fixture(id);

insert into public.transactions (
  id,
  user_id,
  account_id,
  category_id,
  description,
  amount_in_cents,
  type,
  occurred_on,
  created_at,
  updated_at
)
select
  transaction_id,
  fixture.user_id,
  account.id,
  category.id,
  description,
  amount_in_cents,
  fixture.type,
  occurred_on,
  created_at,
  created_at
from (
  values
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A anterior receita', 3000::bigint, 'income', date '2026-02-20', timestamptz '2026-02-20 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A anterior despesa', 500::bigint, 'expense', date '2026-02-28', timestamptz '2026-02-28 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A período receita', 2000::bigint, 'income', date '2026-03-01', timestamptz '2026-03-01 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A período despesa', 700::bigint, 'expense', date '2026-03-03', timestamptz '2026-03-03 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A fim exclusivo', 999::bigint, 'income', date '2026-03-08', timestamptz '2026-03-08 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_b_id')::uuid, 'B período receita', 6000::bigint, 'income', date '2026-03-02', timestamptz '2026-03-02 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.anonymous_user_id')::uuid, 'Anônima', 8000::bigint, 'income', date '2026-03-02', timestamptz '2026-03-02 10:00:00+00')
) as fixture(
  transaction_id,
  user_id,
  description,
  amount_in_cents,
  type,
  occurred_on,
  created_at
)
join lateral (
  select id
  from public.financial_accounts
  where user_id = fixture.user_id
  order by id
  limit 1
) as account on true
join public.categories as category
  on category.user_id = fixture.user_id
 and category.kind = fixture.type;

select set_config('request.jwt.claim.sub', current_setting('test.user_a_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.user_a_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

select is(auth.uid(), current_setting('test.user_a_id')::uuid, 'user A identity is active');

select results_eq(
  $$
    select distinct account_count::bigint, opening_balance_in_cents::bigint
    from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-03-08')
  $$,
  $$values (2::bigint, 10500::bigint)$$,
  'opening balance combines owned account baselines and prior movements'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-03-08')
    where movement_id is not null
  $$,
  $$values (2::bigint)$$,
  'the half-open interval returns only two movements'
);

select results_eq(
  $$
    select
      sum(amount_in_cents) filter (where movement_type = 'income')::bigint,
      sum(amount_in_cents) filter (where movement_type = 'expense')::bigint
    from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-03-08')
  $$,
  $$values (2000::bigint, 700::bigint)$$,
  'snapshot preserves owned income and expense amounts'
);

select results_eq(
  $$
    select array_agg(occurred_on order by occurred_on, created_at, movement_id)
    from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-03-08')
    where movement_id is not null
  $$,
  $$values (array[date '2026-03-01', date '2026-03-03'])$$,
  'movements are returned in stable ascending civil order'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-03-08')
    where amount_in_cents in (6000, 8000, 999)
  $$,
  $$values (0::bigint)$$,
  'other tenants, anonymous Auth and the exclusive end do not leak'
);

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.user_b_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.user_b_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

select results_eq(
  $$
    select distinct account_count::bigint, opening_balance_in_cents::bigint
    from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-03-08')
  $$,
  $$values (1::bigint, 4000::bigint)$$,
  'user B receives only the own snapshot baseline'
);

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.user_c_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.user_c_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

select results_eq(
  $$
    select
      account_count::bigint,
      opening_balance_in_cents::bigint,
      movement_id is null
    from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-03-08')
  $$,
  $$values (0::bigint, 0::bigint, true)$$,
  'a user without accounts receives one empty snapshot row'
);

select throws_ok(
  $$select * from public.load_financial_evolution_snapshot(null::date, date '2026-03-08')$$,
  '22023',
  null,
  'null start is rejected'
);
select throws_ok(
  $$select * from public.load_financial_evolution_snapshot(date '2026-03-01', null::date)$$,
  '22023',
  null,
  'null end is rejected'
);
select throws_ok(
  $$select * from public.load_financial_evolution_snapshot(date '2026-03-08', date '2026-03-01')$$,
  '22023',
  null,
  'an inverted interval is rejected'
);
select throws_ok(
  $$select * from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-04-02')$$,
  '22023',
  null,
  'an interval over 31 days is rejected'
);

reset role;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000000', true);
select set_config('request.jwt.claims', '{}', true);
set local role anon;
select throws_ok(
  $$select * from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-03-08')$$,
  '42501',
  null,
  'anon cannot execute the snapshot function'
);

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.anonymous_user_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.anonymous_user_id'),
    'role', 'authenticated',
    'is_anonymous', true
  )::text,
  true
);
set local role authenticated;
select throws_ok(
  $$select * from public.load_financial_evolution_snapshot(date '2026-03-01', date '2026-03-08')$$,
  '42501',
  null,
  'anonymous Auth cannot execute an analytics snapshot'
);

reset role;
select * from finish();
rollback;
