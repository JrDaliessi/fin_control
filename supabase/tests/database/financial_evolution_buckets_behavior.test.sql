begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(27);

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
  (current_setting('test.user_a_id')::uuid, 'Conta A', 'checking', 10000),
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
  fixture.transaction_id,
  fixture.user_id,
  account.id,
  category.id,
  fixture.description,
  fixture.amount_in_cents,
  fixture.type,
  fixture.occurred_on,
  fixture.created_at,
  fixture.created_at
from (
  values
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A anterior receita', 1000::bigint, 'income', date '2026-06-29', timestamptz '2026-06-29 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A anterior despesa', 500::bigint, 'expense', date '2026-06-30', timestamptz '2026-06-30 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A primeira receita', 2000::bigint, 'income', date '2026-07-01', timestamptz '2026-07-01 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A primeira despesa', 700::bigint, 'expense', date '2026-07-03', timestamptz '2026-07-03 09:00:00+00'),
    ('00000000-0000-4000-8000-000000000001'::uuid, current_setting('test.user_a_id')::uuid, 'A empate despesa', 3000::bigint, 'expense', date '2026-07-13', timestamptz '2026-07-13 09:00:00+00'),
    ('00000000-0000-4000-8000-000000000002'::uuid, current_setting('test.user_a_id')::uuid, 'A empate receita', 5000::bigint, 'income', date '2026-07-13', timestamptz '2026-07-13 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A último bucket', 800::bigint, 'expense', date '2026-09-30', timestamptz '2026-09-30 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_a_id')::uuid, 'A fim exclusivo', 999::bigint, 'income', date '2026-10-01', timestamptz '2026-10-01 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.user_b_id')::uuid, 'B receita', 6000::bigint, 'income', date '2026-07-02', timestamptz '2026-07-02 09:00:00+00'),
    (gen_random_uuid(), current_setting('test.anonymous_user_id')::uuid, 'Anônima', 8000::bigint, 'income', date '2026-07-02', timestamptz '2026-07-02 10:00:00+00')
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
    select count(*)::bigint
    from public.load_financial_evolution_buckets(
      date '2026-07-01', date '2026-10-01', 'week'
    )
  $$,
  $$values (14::bigint)$$,
  'three civil months produce fourteen clipped weekly buckets'
);

select results_eq(
  $$
    select min(start_on_inclusive), max(end_on_exclusive)
    from public.load_financial_evolution_buckets(
      date '2026-07-01', date '2026-10-01', 'week'
    )
  $$,
  $$values (date '2026-07-01', date '2026-10-01')$$,
  'weekly buckets cover the selected half-open interval exactly'
);

select results_eq(
  $$
    select
      open_in_cents::bigint,
      high_in_cents::bigint,
      low_in_cents::bigint,
      close_in_cents::bigint,
      income_in_cents::bigint,
      expense_in_cents::bigint,
      volume_in_cents::bigint,
      transaction_count
    from public.load_financial_evolution_buckets(
      date '2026-07-01', date '2026-10-01', 'week'
    )
    where start_on_inclusive = date '2026-07-01'
  $$,
  $$values (10500::bigint, 12500::bigint, 10500::bigint, 11800::bigint, 2000::bigint, 700::bigint, 2700::bigint, 2::bigint)$$,
  'first partial week computes opening, OHLC, totals and volume'
);

select results_eq(
  $$
    select
      open_in_cents::bigint,
      high_in_cents::bigint,
      low_in_cents::bigint,
      close_in_cents::bigint,
      volume_in_cents::bigint,
      transaction_count
    from public.load_financial_evolution_buckets(
      date '2026-07-01', date '2026-10-01', 'week'
    )
    where start_on_inclusive = date '2026-07-06'
  $$,
  $$values (11800::bigint, 11800::bigint, 11800::bigint, 11800::bigint, 0::bigint, 0::bigint)$$,
  'empty week carries the prior close without manufacturing movement'
);

select results_eq(
  $$
    select
      open_in_cents::bigint,
      high_in_cents::bigint,
      low_in_cents::bigint,
      close_in_cents::bigint
    from public.load_financial_evolution_buckets(
      date '2026-07-01', date '2026-10-01', 'week'
    )
    where start_on_inclusive = date '2026-07-13'
  $$,
  $$values (11800::bigint, 13800::bigint, 8800::bigint, 13800::bigint)$$,
  'same-instant movements use id as the deterministic OHLC tie-breaker'
);

select results_eq(
  $$
    select start_on_inclusive, end_on_exclusive, close_in_cents::bigint
    from public.load_financial_evolution_buckets(
      date '2026-07-01', date '2026-10-01', 'week'
    )
    order by start_on_inclusive desc
    limit 1
  $$,
  $$values (date '2026-09-28', date '2026-10-01', 13000::bigint)$$,
  'last weekly bucket is clipped to the exclusive period boundary'
);

select results_eq(
  $$
    select
      sum(income_in_cents)::bigint,
      sum(expense_in_cents)::bigint,
      sum(transaction_count)::bigint
    from public.load_financial_evolution_buckets(
      date '2026-07-01', date '2026-10-01', 'week'
    )
  $$,
  $$values (7000::bigint, 4500::bigint, 5::bigint)$$,
  'exclusive end and other tenants never enter aggregate totals'
);

select results_eq(
  $$
    select distinct account_count
    from public.load_financial_evolution_buckets(
      date '2026-07-01', date '2026-10-01', 'week'
    )
  $$,
  $$values (1::bigint)$$,
  'account count contains only accounts owned by user A'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.load_financial_evolution_buckets(
      date '2026-01-01', date '2027-01-01', 'month'
    )
  $$,
  $$values (12::bigint)$$,
  'a civil year produces twelve monthly buckets'
);

select results_eq(
  $$
    select
      open_in_cents::bigint,
      high_in_cents::bigint,
      low_in_cents::bigint,
      close_in_cents::bigint,
      income_in_cents::bigint,
      expense_in_cents::bigint
    from public.load_financial_evolution_buckets(
      date '2026-01-01', date '2027-01-01', 'month'
    )
    where start_on_inclusive = date '2026-07-01'
  $$,
  $$values (10500::bigint, 13800::bigint, 8800::bigint, 13800::bigint, 7000::bigint, 3700::bigint)$$,
  'monthly bucket preserves deterministic OHLC and totals'
);

select results_eq(
  $$
    select open_in_cents::bigint, close_in_cents::bigint, transaction_count
    from public.load_financial_evolution_buckets(
      date '2026-01-01', date '2027-01-01', 'month'
    )
    where start_on_inclusive = date '2026-08-01'
  $$,
  $$values (13800::bigint, 13800::bigint, 0::bigint)$$,
  'empty month carries the July closing balance'
);

select results_eq(
  $$
    select count(*)::bigint, min(start_on_inclusive), max(end_on_exclusive)
    from public.load_financial_evolution_buckets(
      date '2024-02-15', date '2027-04-10', 'quarter'
    )
  $$,
  $$values (14::bigint, date '2024-02-15', date '2027-04-10')$$,
  'quarter buckets preserve both partial civil boundaries'
);

select results_eq(
  $$
    select count(*)::bigint, min(start_on_inclusive), max(end_on_exclusive)
    from public.load_financial_evolution_buckets(
      date '2000-06-15', date '2026-09-13', 'year'
    )
  $$,
  $$values (27::bigint, date '2000-06-15', date '2026-09-13')$$,
  'annual buckets cover long history without exposing raw movements'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.load_financial_evolution_buckets(
      date '1967-09-13', date '2026-09-13', 'year'
    )
  $$,
  $$values (60::bigint)$$,
  'exactly sixty intersecting annual buckets are accepted'
);

select throws_ok(
  $$select * from public.load_financial_evolution_buckets(date '1966-09-12', date '2026-09-13', 'year')$$,
  '22023',
  'financial evolution bucket interval exceeds 60 years',
  'an interval above sixty civil years is rejected independently'
);

select throws_ok(
  $$select * from public.load_financial_evolution_buckets(date '2011-08-01', date '2026-09-13', 'quarter')$$,
  '22023',
  'financial evolution bucket count exceeds 60',
  'more than sixty quarter buckets are rejected independently'
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
    select distinct account_count, open_in_cents::bigint, close_in_cents::bigint
    from public.load_financial_evolution_buckets(
      date '2026-07-01', date '2026-07-06', 'week'
    )
  $$,
  $$values (1::bigint, 4000::bigint, 10000::bigint)$$,
  'user B receives only the own account and movements'
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
    select distinct
      account_count,
      open_in_cents::bigint,
      close_in_cents::bigint,
      transaction_count
    from public.load_financial_evolution_buckets(
      date '2026-01-01', date '2027-01-01', 'month'
    )
  $$,
  $$values (0::bigint, 0::bigint, 0::bigint, 0::bigint)$$,
  'a user without accounts receives zeroed buckets without foreign data'
);

select throws_ok(
  $$select * from public.load_financial_evolution_buckets(null::date, date '2026-10-01', 'week')$$,
  '22023',
  null,
  'null start is rejected'
);
select throws_ok(
  $$select * from public.load_financial_evolution_buckets(date '2026-07-01', null::date, 'week')$$,
  '22023',
  null,
  'null end is rejected'
);
select throws_ok(
  $$select * from public.load_financial_evolution_buckets(date '2026-10-01', date '2026-07-01', 'week')$$,
  '22023',
  null,
  'an inverted interval is rejected'
);
select throws_ok(
  $$select * from public.load_financial_evolution_buckets(date '2026-07-01', date '2026-10-01', 'day')$$,
  '22023',
  null,
  'bucket outside the aggregate allowlist is rejected'
);
select results_eq(
  $$
    select count(*)::bigint
    from public.load_financial_evolution_buckets(
      date '2024-01-01', date '2025-04-01', 'month'
    )
  $$,
  $$values (15::bigint)$$,
  'a valid aggregate interval may exceed the previous 366-day ceiling'
);
select throws_ok(
  $$select * from public.load_financial_evolution_buckets(date '2024-01-01', date '2025-03-01', 'week')$$,
  '22023',
  'financial evolution bucket count exceeds 60',
  'a request exceeding the point ceiling is rejected'
);

reset role;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000000', true);
select set_config('request.jwt.claims', '{}', true);
set local role anon;
select throws_ok(
  $$select * from public.load_financial_evolution_buckets(date '2026-07-01', date '2026-10-01', 'week')$$,
  '42501',
  null,
  'anon cannot execute the aggregate function'
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
  $$select * from public.load_financial_evolution_buckets(date '2026-07-01', date '2026-10-01', 'week')$$,
  '42501',
  null,
  'anonymous Auth cannot execute financial aggregation'
);

reset role;
select * from finish();
rollback;
