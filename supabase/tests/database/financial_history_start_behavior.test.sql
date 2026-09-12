begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(5);

select set_config('test.history_user_a_id', gen_random_uuid()::text, true);
select set_config('test.history_user_b_id', gen_random_uuid()::text, true);
select set_config('test.history_user_c_id', gen_random_uuid()::text, true);
select set_config('test.history_anonymous_user_id', gen_random_uuid()::text, true);

insert into auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data,
  is_anonymous, created_at, updated_at
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
    (current_setting('test.history_user_a_id')::uuid, false),
    (current_setting('test.history_user_b_id')::uuid, false),
    (current_setting('test.history_user_c_id')::uuid, false),
    (current_setting('test.history_anonymous_user_id')::uuid, true)
) as fixture(id, is_anonymous);

insert into public.financial_accounts (user_id, name, type, initial_balance_in_cents)
select id, 'Conta ' || id::text, 'checking', 1000
from (
  values
    (current_setting('test.history_user_a_id')::uuid),
    (current_setting('test.history_user_b_id')::uuid),
    (current_setting('test.history_anonymous_user_id')::uuid)
) as fixture(id);

insert into public.categories (user_id, name, kind)
select id, 'Receita ' || id::text, 'income'
from (
  values
    (current_setting('test.history_user_a_id')::uuid),
    (current_setting('test.history_user_b_id')::uuid),
    (current_setting('test.history_anonymous_user_id')::uuid)
) as fixture(id);

insert into public.transactions (
  user_id, account_id, category_id, description,
  amount_in_cents, type, occurred_on, created_at, updated_at
)
select
  fixture.user_id,
  account.id,
  category.id,
  fixture.description,
  100,
  'income',
  fixture.occurred_on,
  fixture.created_at,
  fixture.created_at
from (
  values
    (current_setting('test.history_user_a_id')::uuid, 'A posterior', date '2024-07-10', timestamptz '2020-01-01 09:00:00+00'),
    (current_setting('test.history_user_a_id')::uuid, 'A primeira ocorrência', date '2020-04-03', timestamptz '2024-01-01 09:00:00+00'),
    (current_setting('test.history_user_b_id')::uuid, 'B anterior', date '1999-12-31', timestamptz '2026-01-01 09:00:00+00'),
    (current_setting('test.history_anonymous_user_id')::uuid, 'Anônima anterior', date '1990-01-01', timestamptz '2026-01-01 09:00:00+00')
) as fixture(user_id, description, occurred_on, created_at)
join public.financial_accounts as account on account.user_id = fixture.user_id
join public.categories as category
  on category.user_id = fixture.user_id
 and category.kind = 'income';

select set_config('request.jwt.claim.sub', current_setting('test.history_user_a_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.history_user_a_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

select is(
  public.load_financial_history_start(),
  date '2020-04-03',
  'owner receives the smallest visible occurrence date, not creation order'
);

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.history_user_b_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.history_user_b_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

select is(
  public.load_financial_history_start(),
  date '1999-12-31',
  'another tenant receives only its own history start'
);

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.history_user_c_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.history_user_c_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

select is(
  public.load_financial_history_start(),
  null::date,
  'authenticated user without transactions receives null'
);

reset role;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000000', true);
select set_config('request.jwt.claims', '{}', true);
set local role anon;

select throws_ok(
  $$select public.load_financial_history_start()$$,
  '42501',
  null,
  'anon cannot execute financial history lookup'
);

reset role;
select set_config(
  'request.jwt.claim.sub',
  current_setting('test.history_anonymous_user_id'),
  true
);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.history_anonymous_user_id'),
    'role', 'authenticated',
    'is_anonymous', true
  )::text,
  true
);
set local role authenticated;

select throws_ok(
  $$select public.load_financial_history_start()$$,
  '42501',
  'financial evolution is unavailable',
  'anonymous Auth identity is rejected inside the function'
);

reset role;
select * from finish();
rollback;
