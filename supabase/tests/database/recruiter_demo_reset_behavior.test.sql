begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(16);

select set_config('test.demo_user_id', gen_random_uuid()::text, true);
select set_config('test.common_user_id', gen_random_uuid()::text, true);
select set_config('test.second_demo_user_id', gen_random_uuid()::text, true);

-- Keep the fixture deterministic even when this transactional test is run
-- against an environment that already contains the operational demo account.
update auth.users
set raw_app_meta_data = raw_app_meta_data - 'account_type' - 'audience'
where raw_app_meta_data ->> 'account_type' = 'demo'
  and raw_app_meta_data ->> 'audience' = 'recruiter';

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
values
  (
    current_setting('test.demo_user_id')::uuid,
    'authenticated',
    'authenticated',
    current_setting('test.demo_user_id') || '@example.invalid',
    '{"provider":"email","providers":["email"],"account_type":"demo","audience":"recruiter"}'::jsonb,
    '{}'::jsonb,
    false,
    now(),
    now()
  ),
  (
    current_setting('test.common_user_id')::uuid,
    'authenticated',
    'authenticated',
    current_setting('test.common_user_id') || '@example.invalid',
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
values
  (current_setting('test.demo_user_id')::uuid, 'Conta alterada pelo avaliador', 'checking', 999),
  (current_setting('test.common_user_id')::uuid, 'Conta permanente', 'savings', 123456);

insert into public.categories (user_id, name, kind)
values
  (current_setting('test.demo_user_id')::uuid, 'Categoria extra', 'expense'),
  (current_setting('test.common_user_id')::uuid, 'Categoria permanente', 'income');

insert into public.transactions (
  user_id,
  account_id,
  category_id,
  description,
  amount_in_cents,
  type,
  payment_method,
  occurred_on
)
select
  account.user_id,
  account.id,
  category.id,
  fixture.description,
  fixture.amount_in_cents,
  category.kind,
  'manual',
  date '2026-08-01'
from (
  values
    (current_setting('test.demo_user_id')::uuid, 'Movimento extra', 999::bigint),
    (current_setting('test.common_user_id')::uuid, 'Movimento permanente', 123456::bigint)
) as fixture(user_id, description, amount_in_cents)
join public.financial_accounts as account on account.user_id = fixture.user_id
join public.categories as category on category.user_id = fixture.user_id;

select set_config(
  'test.common_snapshot',
  (
    select jsonb_build_object(
      'accounts', (
        select coalesce(jsonb_agg(to_jsonb(account) order by account.id), '[]'::jsonb)
        from public.financial_accounts as account
        where account.user_id = current_setting('test.common_user_id')::uuid
      ),
      'categories', (
        select coalesce(jsonb_agg(to_jsonb(category) order by category.id), '[]'::jsonb)
        from public.categories as category
        where category.user_id = current_setting('test.common_user_id')::uuid
      ),
      'transactions', (
        select coalesce(jsonb_agg(to_jsonb(transaction_row) order by transaction_row.id), '[]'::jsonb)
        from public.transactions as transaction_row
        where transaction_row.user_id = current_setting('test.common_user_id')::uuid
      )
    )::text
  ),
  true
);

select throws_ok(
  $$select private.reset_recruiter_demo_data(null::date)$$,
  '22023',
  null,
  'null reference date is rejected before mutation'
);

select set_config(
  'test.demo_before_failure',
  (
    select jsonb_build_object(
      'accounts', (
        select coalesce(jsonb_agg(to_jsonb(account) order by account.id), '[]'::jsonb)
        from public.financial_accounts as account
        where account.user_id = current_setting('test.demo_user_id')::uuid
      ),
      'categories', (
        select coalesce(jsonb_agg(to_jsonb(category) order by category.id), '[]'::jsonb)
        from public.categories as category
        where category.user_id = current_setting('test.demo_user_id')::uuid
      ),
      'transactions', (
        select coalesce(jsonb_agg(to_jsonb(transaction_row) order by transaction_row.id), '[]'::jsonb)
        from public.transactions as transaction_row
        where transaction_row.user_id = current_setting('test.demo_user_id')::uuid
      )
    )::text
  ),
  true
);

alter table public.categories
  add constraint categories_demo_reset_test_reject
  check (name <> 'Alimentação') not valid;

select throws_ok(
  $$select private.reset_recruiter_demo_data(date '2026-09-05')$$,
  '23514',
  null,
  'an intermediate baseline failure aborts the reset'
);

alter table public.categories
  drop constraint categories_demo_reset_test_reject;

select is(
  (
    select jsonb_build_object(
      'accounts', (
        select coalesce(jsonb_agg(to_jsonb(account) order by account.id), '[]'::jsonb)
        from public.financial_accounts as account
        where account.user_id = current_setting('test.demo_user_id')::uuid
      ),
      'categories', (
        select coalesce(jsonb_agg(to_jsonb(category) order by category.id), '[]'::jsonb)
        from public.categories as category
        where category.user_id = current_setting('test.demo_user_id')::uuid
      ),
      'transactions', (
        select coalesce(jsonb_agg(to_jsonb(transaction_row) order by transaction_row.id), '[]'::jsonb)
        from public.transactions as transaction_row
        where transaction_row.user_id = current_setting('test.demo_user_id')::uuid
      )
    )::text
  ),
  current_setting('test.demo_before_failure'),
  'a failed reset restores the exact previous demo state'
);

select lives_ok(
  $$select private.reset_recruiter_demo_data(date '2026-09-05')$$,
  'one tagged recruiter demo account is restored'
);

select results_eq(
  $$
    select
      (select count(*) from public.financial_accounts where user_id = current_setting('test.demo_user_id')::uuid)::bigint,
      (select count(*) from public.categories where user_id = current_setting('test.demo_user_id')::uuid)::bigint,
      (select count(*) from public.transactions where user_id = current_setting('test.demo_user_id')::uuid)::bigint
  $$,
  $$values (3::bigint, 6::bigint, 8::bigint)$$,
  'baseline has exactly three accounts, six categories and eight transactions'
);

select results_eq(
  $$
    select name, type, initial_balance_in_cents, currency
    from public.financial_accounts
    where user_id = current_setting('test.demo_user_id')::uuid
    order by name
  $$,
  $$
    values
      ('Carteira Demo'::text, 'cash'::text, 15000::bigint, 'BRL'::text),
      ('Conta Corrente Demo'::text, 'checking'::text, 350000::bigint, 'BRL'::text),
      ('Reserva Demo'::text, 'savings'::text, 1250000::bigint, 'BRL'::text)
  $$,
  'baseline accounts match the approved logical content'
);

select results_eq(
  $$
    select name, kind
    from public.categories
    where user_id = current_setting('test.demo_user_id')::uuid
    order by kind, name
  $$,
  $$
    values
      ('Alimentação'::text, 'expense'::text),
      ('Moradia'::text, 'expense'::text),
      ('Serviços'::text, 'expense'::text),
      ('Transporte'::text, 'expense'::text),
      ('Renda extra'::text, 'income'::text),
      ('Salário'::text, 'income'::text)
  $$,
  'baseline categories match the approved logical content'
);

select results_eq(
  $$
    select
      transaction_row.description,
      transaction_row.amount_in_cents,
      transaction_row.type,
      transaction_row.payment_method,
      transaction_row.occurred_on,
      account.name,
      category.name
    from public.transactions as transaction_row
    join public.financial_accounts as account
      on account.user_id = transaction_row.user_id
     and account.id = transaction_row.account_id
    join public.categories as category
      on category.user_id = transaction_row.user_id
     and category.id = transaction_row.category_id
    where transaction_row.user_id = current_setting('test.demo_user_id')::uuid
    order by transaction_row.occurred_on, transaction_row.description
  $$,
  $$
    select *
    from (
      values
        ('Salário mensal'::text, 580000::bigint, 'income'::text, 'pix'::text, date '2026-09-01', 'Conta Corrente Demo'::text, 'Salário'::text),
        ('Aluguel residencial'::text, 185000::bigint, 'expense'::text, 'pix'::text, date '2026-09-02', 'Conta Corrente Demo'::text, 'Moradia'::text),
        ('Compras do supermercado'::text, 48732::bigint, 'expense'::text, 'debit'::text, date '2026-09-03', 'Conta Corrente Demo'::text, 'Alimentação'::text),
        ('Internet e celular'::text, 17990::bigint, 'expense'::text, 'debit'::text, date '2026-09-03', 'Conta Corrente Demo'::text, 'Serviços'::text),
        ('Projeto freelancer'::text, 125000::bigint, 'income'::text, 'pix'::text, date '2026-09-04', 'Conta Corrente Demo'::text, 'Renda extra'::text),
        ('Transporte por aplicativo'::text, 8640::bigint, 'expense'::text, 'debit'::text, date '2026-09-04', 'Conta Corrente Demo'::text, 'Transporte'::text),
        ('Café e almoço'::text, 6450::bigint, 'expense'::text, 'cash'::text, date '2026-09-05', 'Carteira Demo'::text, 'Alimentação'::text),
        ('Cashback do cartão'::text, 8500::bigint, 'income'::text, 'pix'::text, date '2026-09-05', 'Conta Corrente Demo'::text, 'Renda extra'::text)
    ) as expected(description, amount_in_cents, type, payment_method, occurred_on, account_name, category_name)
    order by occurred_on, description
  $$,
  'baseline transactions preserve approved values, relations and relative dates'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.transactions
    where user_id = current_setting('test.demo_user_id')::uuid
      and occurred_on > date '2026-09-05'
  $$,
  $$values (0::bigint)$$,
  'baseline never creates future transactions'
);

select is(
  (
    select jsonb_build_object(
      'accounts', (
        select coalesce(jsonb_agg(to_jsonb(account) order by account.id), '[]'::jsonb)
        from public.financial_accounts as account
        where account.user_id = current_setting('test.common_user_id')::uuid
      ),
      'categories', (
        select coalesce(jsonb_agg(to_jsonb(category) order by category.id), '[]'::jsonb)
        from public.categories as category
        where category.user_id = current_setting('test.common_user_id')::uuid
      ),
      'transactions', (
        select coalesce(jsonb_agg(to_jsonb(transaction_row) order by transaction_row.id), '[]'::jsonb)
        from public.transactions as transaction_row
        where transaction_row.user_id = current_setting('test.common_user_id')::uuid
      )
    )::text
  ),
  current_setting('test.common_snapshot'),
  'ordinary tenant data remains byte-for-byte unchanged'
);

select set_config(
  'test.demo_logical_snapshot',
  (
    select jsonb_build_object(
      'accounts', (
        select jsonb_agg(jsonb_build_array(name, type, initial_balance_in_cents, currency) order by name)
        from public.financial_accounts
        where user_id = current_setting('test.demo_user_id')::uuid
      ),
      'categories', (
        select jsonb_agg(jsonb_build_array(name, kind) order by kind, name)
        from public.categories
        where user_id = current_setting('test.demo_user_id')::uuid
      ),
      'transactions', (
        select jsonb_agg(
          jsonb_build_array(
            transaction_row.description,
            transaction_row.amount_in_cents,
            transaction_row.type,
            transaction_row.payment_method,
            transaction_row.occurred_on,
            account.name,
            category.name
          )
          order by transaction_row.occurred_on, transaction_row.description
        )
        from public.transactions as transaction_row
        join public.financial_accounts as account
          on account.user_id = transaction_row.user_id
         and account.id = transaction_row.account_id
        join public.categories as category
          on category.user_id = transaction_row.user_id
         and category.id = transaction_row.category_id
        where transaction_row.user_id = current_setting('test.demo_user_id')::uuid
      )
    )::text
  ),
  true
);

select lives_ok(
  $$select private.reset_recruiter_demo_data(date '2026-09-05')$$,
  'a second reset succeeds'
);

select is(
  (
    select jsonb_build_object(
      'accounts', (
        select jsonb_agg(jsonb_build_array(name, type, initial_balance_in_cents, currency) order by name)
        from public.financial_accounts
        where user_id = current_setting('test.demo_user_id')::uuid
      ),
      'categories', (
        select jsonb_agg(jsonb_build_array(name, kind) order by kind, name)
        from public.categories
        where user_id = current_setting('test.demo_user_id')::uuid
      ),
      'transactions', (
        select jsonb_agg(
          jsonb_build_array(
            transaction_row.description,
            transaction_row.amount_in_cents,
            transaction_row.type,
            transaction_row.payment_method,
            transaction_row.occurred_on,
            account.name,
            category.name
          )
          order by transaction_row.occurred_on, transaction_row.description
        )
        from public.transactions as transaction_row
        join public.financial_accounts as account
          on account.user_id = transaction_row.user_id
         and account.id = transaction_row.account_id
        join public.categories as category
          on category.user_id = transaction_row.user_id
         and category.id = transaction_row.category_id
        where transaction_row.user_id = current_setting('test.demo_user_id')::uuid
      )
    )::text
  ),
  current_setting('test.demo_logical_snapshot'),
  'repeated reset is logically idempotent'
);

update auth.users
set raw_app_meta_data = raw_app_meta_data - 'account_type' - 'audience'
where id = current_setting('test.demo_user_id')::uuid;

select throws_ok(
  $$select private.reset_recruiter_demo_data(date '2026-09-05')$$,
  'P0001',
  null,
  'zero recruiter demo candidates aborts before mutation'
);

select results_eq(
  $$
    select
      (select count(*) from public.financial_accounts where user_id = current_setting('test.demo_user_id')::uuid)::bigint,
      (select count(*) from public.categories where user_id = current_setting('test.demo_user_id')::uuid)::bigint,
      (select count(*) from public.transactions where user_id = current_setting('test.demo_user_id')::uuid)::bigint
  $$,
  $$values (3::bigint, 6::bigint, 8::bigint)$$,
  'zero-candidate rejection preserves the existing demo baseline'
);

update auth.users
set raw_app_meta_data = raw_app_meta_data
  || '{"account_type":"demo","audience":"recruiter"}'::jsonb
where id = current_setting('test.demo_user_id')::uuid;

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
  current_setting('test.second_demo_user_id')::uuid,
  'authenticated',
  'authenticated',
  current_setting('test.second_demo_user_id') || '@example.invalid',
  '{"provider":"email","providers":["email"],"account_type":"demo","audience":"recruiter"}'::jsonb,
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
  current_setting('test.second_demo_user_id')::uuid,
  'Segundo candidato',
  'cash',
  1
);

select throws_ok(
  $$select private.reset_recruiter_demo_data(date '2026-09-05')$$,
  'P0001',
  null,
  'multiple recruiter demo candidates abort before mutation'
);

select results_eq(
  $$
    select
      (select count(*) from public.financial_accounts where user_id = current_setting('test.demo_user_id')::uuid)::bigint,
      (select count(*) from public.categories where user_id = current_setting('test.demo_user_id')::uuid)::bigint,
      (select count(*) from public.transactions where user_id = current_setting('test.demo_user_id')::uuid)::bigint,
      (select count(*) from public.financial_accounts where user_id = current_setting('test.second_demo_user_id')::uuid)::bigint
  $$,
  $$values (3::bigint, 6::bigint, 8::bigint, 1::bigint)$$,
  'multiple-candidate rejection preserves both candidate tenants'
);

select * from finish();
rollback;
