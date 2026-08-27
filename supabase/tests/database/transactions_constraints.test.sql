begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(21);

select set_config('test.user_a_id', gen_random_uuid()::text, true);
select set_config('test.user_b_id', gen_random_uuid()::text, true);

insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_anonymous, created_at, updated_at)
select id, 'authenticated', 'authenticated', id::text || '@example.invalid', '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, now(), now()
from (values (current_setting('test.user_a_id')::uuid), (current_setting('test.user_b_id')::uuid)) as fixture(id);

insert into public.financial_accounts (user_id, name, type, initial_balance_in_cents)
values
  (current_setting('test.user_a_id')::uuid, 'Conta A', 'checking', 10000),
  (current_setting('test.user_b_id')::uuid, 'Conta B', 'checking', 20000);

insert into public.categories (user_id, name, kind)
values
  (current_setting('test.user_a_id')::uuid, 'Despesa A', 'expense'),
  (current_setting('test.user_a_id')::uuid, 'Receita A', 'income'),
  (current_setting('test.user_b_id')::uuid, 'Despesa B', 'expense');

select set_config('test.account_a_id', (select id::text from public.financial_accounts where user_id = current_setting('test.user_a_id')::uuid), true);
select set_config('test.account_b_id', (select id::text from public.financial_accounts where user_id = current_setting('test.user_b_id')::uuid), true);
select set_config('test.expense_a_id', (select id::text from public.categories where user_id = current_setting('test.user_a_id')::uuid and kind = 'expense'), true);
select set_config('test.income_a_id', (select id::text from public.categories where user_id = current_setting('test.user_a_id')::uuid and kind = 'income'), true);
select set_config('test.expense_b_id', (select id::text from public.categories where user_id = current_setting('test.user_b_id')::uuid and kind = 'expense'), true);

select lives_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Mercado', 12550, 'expense', date '2026-07-08')$$, 'valid expense is accepted');
select lives_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, payment_method, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.income_a_id')::uuid, 'Salário', 500000, 'income', 'pix', date '2026-07-05')$$, 'valid income is accepted');
select ok(exists (select 1 from public.transactions where description = 'Mercado' and payment_method = 'manual' and id is not null and created_at is not null and updated_at is not null), 'defaults populate id timestamps and manual method');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, '', 1, 'expense', current_date)$$, '23514', null, 'empty description is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, ' Padded ', 1, 'expense', current_date)$$, '23514', null, 'padded description is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, repeat('a', 161), 1, 'expense', current_date)$$, '23514', null, 'long description is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Zero', 0, 'expense', current_date)$$, '23514', null, 'zero amount is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Unsafe', 9007199254740992, 'expense', current_date)$$, '23514', null, 'unsafe amount is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Other', 1, 'transfer', current_date)$$, '23514', null, 'unsupported type is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, payment_method, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Card', 1, 'expense', 'credit', current_date)$$, '23514', null, 'unsupported payment method is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on, notes) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Notes', 1, 'expense', current_date, ' Padded ')$$, '23514', null, 'padded notes are rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on, notes) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Notes', 1, 'expense', current_date, repeat('a', 1001))$$, '23514', null, 'long notes are rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (gen_random_uuid(), current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Missing user', 1, 'expense', current_date)$$, '23503', null, 'missing auth user is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, gen_random_uuid(), current_setting('test.expense_a_id')::uuid, 'Missing account', 1, 'expense', current_date)$$, '23503', null, 'missing account is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_b_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Cross account', 1, 'expense', current_date)$$, '23503', null, 'cross-tenant account is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, gen_random_uuid(), 'Missing category', 1, 'expense', current_date)$$, '23503', null, 'missing category is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_b_id')::uuid, 'Cross category', 1, 'expense', current_date)$$, '23503', null, 'cross-tenant category is rejected');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.income_a_id')::uuid, 'Wrong kind', 1, 'expense', current_date)$$, '23503', null, 'category kind must match transaction type');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.expense_a_id')::uuid, 'Missing date', 1, 'expense', null)$$, '23502', null, 'occurred_on is required');
select throws_ok($$delete from public.financial_accounts where id = current_setting('test.account_a_id')::uuid$$, '23503', null, 'referenced account deletion is restricted');
select throws_ok($$delete from public.categories where id = current_setting('test.expense_a_id')::uuid$$, '23503', null, 'referenced category deletion is restricted');

select * from finish();
rollback;
