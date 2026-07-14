begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(13);

select set_config('test.user_a_id', gen_random_uuid()::text, true);

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
  current_setting('test.user_a_id')::uuid,
  'authenticated',
  'authenticated',
  current_setting('test.user_a_id') || '@example.invalid',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  now(),
  now()
);

select lives_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (current_setting('test.user_a_id')::uuid, 'Conta positiva', 'checking', 150000)$$,
  'a positive initial balance is accepted'
);

select lives_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (current_setting('test.user_a_id')::uuid, 'Conta zero', 'cash', 0)$$,
  'a zero initial balance is accepted'
);

select lives_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (current_setting('test.user_a_id')::uuid, 'Conta negativa', 'payment', -25000)$$,
  'a negative initial balance is accepted'
);

select throws_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (current_setting('test.user_a_id')::uuid, '', 'checking', 0)$$,
  '23514', null, 'an empty name is rejected'
);

select throws_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (current_setting('test.user_a_id')::uuid, ' Padded ', 'checking', 0)$$,
  '23514', null, 'a non-trimmed name is rejected'
);

select throws_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (current_setting('test.user_a_id')::uuid, repeat('a', 81), 'checking', 0)$$,
  '23514', null, 'a name longer than 80 characters is rejected'
);

select throws_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (current_setting('test.user_a_id')::uuid, 'Conta inválida', 'salary', 0)$$,
  '23514', null, 'an unsupported account type is rejected'
);

select throws_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents, currency)
    values (current_setting('test.user_a_id')::uuid, 'Conta dólar', 'checking', 0, 'USD')$$,
  '23514', null, 'a currency other than BRL is rejected'
);

select throws_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (current_setting('test.user_a_id')::uuid, 'Saldo alto', 'checking', 9007199254740992)$$,
  '23514', null, 'a balance above the JavaScript safe range is rejected'
);

select throws_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (current_setting('test.user_a_id')::uuid, 'Saldo baixo', 'checking', -9007199254740992)$$,
  '23514', null, 'a balance below the JavaScript safe range is rejected'
);

select throws_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values (gen_random_uuid(), 'Usuário ausente', 'checking', 0)$$,
  '23503', null, 'a missing auth user is rejected by the foreign key'
);

select ok(
  exists (
    select 1
    from public.financial_accounts
    where user_id = current_setting('test.user_a_id')::uuid
      and name = 'Conta zero'
      and id is not null
      and currency = 'BRL'
      and created_at is not null
      and updated_at is not null
  ),
  'database defaults populate id, BRL and timestamps'
);

select lives_ok(
  $$insert into public.financial_accounts
    (user_id, name, type, initial_balance_in_cents)
    values
      (current_setting('test.user_a_id')::uuid, 'Nome repetido', 'checking', 0),
      (current_setting('test.user_a_id')::uuid, 'Nome repetido', 'savings', 0)$$,
  'duplicate account names are allowed'
);

select * from finish();
rollback;
