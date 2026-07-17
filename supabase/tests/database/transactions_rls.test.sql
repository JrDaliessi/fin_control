begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(17);

select set_config('test.user_a_id', gen_random_uuid()::text, true);
select set_config('test.user_b_id', gen_random_uuid()::text, true);
select set_config('test.anonymous_user_id', gen_random_uuid()::text, true);

insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_anonymous, created_at, updated_at)
select id, 'authenticated', 'authenticated', id::text || '@example.invalid', '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, is_anonymous, now(), now()
from (values (current_setting('test.user_a_id')::uuid, false), (current_setting('test.user_b_id')::uuid, false), (current_setting('test.anonymous_user_id')::uuid, true)) as fixture(id, is_anonymous);

insert into public.financial_accounts (user_id, name, type, initial_balance_in_cents)
select id, 'Conta ' || id::text, 'checking', 0 from (values (current_setting('test.user_a_id')::uuid), (current_setting('test.user_b_id')::uuid), (current_setting('test.anonymous_user_id')::uuid)) as fixture(id);
insert into public.categories (user_id, name, kind)
select id, 'Categoria ' || id::text, 'expense' from (values (current_setting('test.user_a_id')::uuid), (current_setting('test.user_b_id')::uuid), (current_setting('test.anonymous_user_id')::uuid)) as fixture(id);

select set_config('test.account_a_id', (select id::text from public.financial_accounts where user_id = current_setting('test.user_a_id')::uuid), true);
select set_config('test.account_b_id', (select id::text from public.financial_accounts where user_id = current_setting('test.user_b_id')::uuid), true);
select set_config('test.anonymous_account_id', (select id::text from public.financial_accounts where user_id = current_setting('test.anonymous_user_id')::uuid), true);
select set_config('test.category_a_id', (select id::text from public.categories where user_id = current_setting('test.user_a_id')::uuid), true);
select set_config('test.category_b_id', (select id::text from public.categories where user_id = current_setting('test.user_b_id')::uuid), true);
select set_config('test.anonymous_category_id', (select id::text from public.categories where user_id = current_setting('test.anonymous_user_id')::uuid), true);

insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on)
select users.id, accounts.id, categories.id, 'Transação ' || users.id::text, 100, 'expense', date '2026-07-08'
from (values (current_setting('test.user_a_id')::uuid), (current_setting('test.user_b_id')::uuid), (current_setting('test.anonymous_user_id')::uuid)) as users(id)
join public.financial_accounts accounts on accounts.user_id = users.id
join public.categories categories on categories.user_id = users.id and categories.kind = 'expense';

select set_config('request.jwt.claim.sub', current_setting('test.user_a_id'), true);
select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('test.user_a_id'), 'role', 'authenticated', 'is_anonymous', false)::text, true);
set local role authenticated;

select is(auth.uid(), current_setting('test.user_a_id')::uuid, 'user A identity is active');
select results_eq($$select count(*)::bigint from public.transactions$$, $$values (1::bigint)$$, 'user A sees only own transaction');
select results_eq($$select count(*)::bigint from public.transactions where user_id = current_setting('test.user_b_id')::uuid$$, $$values (0::bigint)$$, 'user A cannot query user B');
select lives_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) select current_setting('test.user_a_id')::uuid, accounts.id, categories.id, 'Nova A', 200, 'expense', current_date from public.financial_accounts accounts join public.categories categories on categories.user_id = accounts.user_id and categories.kind = 'expense' where accounts.user_id = current_setting('test.user_a_id')::uuid limit 1$$, 'user A inserts owned transaction');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_b_id')::uuid, current_setting('test.account_b_id')::uuid, current_setting('test.category_b_id')::uuid, 'Forjada', 200, 'expense', current_date)$$, '42501', null, 'user A cannot insert for user B');
select throws_ok($$update public.transactions set description = 'Alterada' where user_id = current_setting('test.user_a_id')::uuid$$, '42501', null, 'authenticated has no update');
select throws_ok($$delete from public.transactions where user_id = current_setting('test.user_a_id')::uuid$$, '42501', null, 'authenticated has no delete');

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.user_b_id'), true);
select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('test.user_b_id'), 'role', 'authenticated', 'is_anonymous', false)::text, true);
set local role authenticated;
select is(auth.uid(), current_setting('test.user_b_id')::uuid, 'user B identity is active');
select results_eq($$select count(*)::bigint from public.transactions$$, $$values (1::bigint)$$, 'user B sees only own transaction');
select results_eq($$select count(*)::bigint from public.transactions where user_id = current_setting('test.user_a_id')::uuid$$, $$values (0::bigint)$$, 'user B cannot query user A');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.user_a_id')::uuid, current_setting('test.account_a_id')::uuid, current_setting('test.category_a_id')::uuid, 'Forjada B', 200, 'expense', current_date)$$, '42501', null, 'user B cannot insert for user A');

reset role;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000000', true);
select set_config('request.jwt.claims', '{}', true);
set local role anon;
select throws_ok($$select * from public.transactions$$, '42501', null, 'anon cannot select');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 'Anon', 1, 'expense', current_date)$$, '42501', null, 'anon cannot insert');

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.anonymous_user_id'), true);
select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('test.anonymous_user_id'), 'role', 'authenticated', 'is_anonymous', true)::text, true);
set local role authenticated;
select is(auth.uid(), current_setting('test.anonymous_user_id')::uuid, 'anonymous Auth identity is active');
select is((auth.jwt() ->> 'is_anonymous')::boolean, true, 'anonymous Auth claim is active');
select results_eq($$select count(*)::bigint from public.transactions$$, $$values (0::bigint)$$, 'anonymous Auth user sees no owned transaction');
select throws_ok($$insert into public.transactions (user_id, account_id, category_id, description, amount_in_cents, type, occurred_on) values (current_setting('test.anonymous_user_id')::uuid, current_setting('test.anonymous_account_id')::uuid, current_setting('test.anonymous_category_id')::uuid, 'Nova anônima', 200, 'expense', current_date)$$, '42501', null, 'anonymous Auth user cannot insert');

reset role;
select * from finish();
rollback;
