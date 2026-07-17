begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(46);

select has_table('public', 'transactions', 'transactions table exists');

select is(
  (select count(*) from information_schema.columns
    where table_schema = 'public' and table_name = 'transactions'),
  12::bigint,
  'transactions has exactly the approved columns'
);

select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'id' and data_type = 'uuid' and is_nullable = 'NO' and column_default ~ 'gen_random_uuid'), 'id is generated uuid');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_pkey' and contype = 'p'), 'id is primary key');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'user_id' and data_type = 'uuid' and is_nullable = 'NO'), 'user_id is required uuid');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_user_id_fkey' and confrelid = 'auth.users'::regclass), 'user_id references auth users');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_user_id_fkey' and confdeltype = 'c'), 'auth user deletion cascades');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'account_id' and data_type = 'uuid' and is_nullable = 'NO'), 'account_id is required uuid');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'category_id' and data_type = 'uuid' and is_nullable = 'NO'), 'category_id is required uuid');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'description' and data_type = 'text' and is_nullable = 'NO'), 'description is required text');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'amount_in_cents' and data_type = 'bigint' and is_nullable = 'NO'), 'amount is required bigint');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'type' and data_type = 'text' and is_nullable = 'NO'), 'type is required text');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'payment_method' and data_type = 'text' and is_nullable = 'NO' and column_default ~ 'manual'), 'payment method defaults to manual');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'occurred_on' and data_type = 'date' and is_nullable = 'NO'), 'occurred_on is required date');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'notes' and data_type = 'text' and is_nullable = 'YES'), 'notes is optional text');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'created_at' and data_type = 'timestamp with time zone' and is_nullable = 'NO' and column_default ~ 'now\(\)'), 'created_at has now default');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'updated_at' and data_type = 'timestamp with time zone' and is_nullable = 'NO' and column_default ~ 'now\(\)'), 'updated_at has now default');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_description_check' and contype = 'c'), 'description check exists');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_amount_in_cents_check' and contype = 'c'), 'amount check exists');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_type_check' and contype = 'c'), 'type check exists');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_payment_method_check' and contype = 'c'), 'payment method check exists');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_notes_check' and contype = 'c'), 'notes check exists');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.financial_accounts') and conname = 'financial_accounts_user_id_id_key' and contype = 'u'), 'account tenant key exists');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.categories') and conname = 'categories_user_id_id_kind_key' and contype = 'u'), 'category owner and kind key exists');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_account_owner_fkey' and confrelid = to_regclass('public.financial_accounts')), 'account composite foreign key exists');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_category_owner_kind_fkey' and confrelid = to_regclass('public.categories')), 'category composite foreign key exists');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_account_owner_fkey' and confdeltype = 'r'), 'account deletion is restricted');
select ok(exists (select 1 from pg_constraint where conrelid = to_regclass('public.transactions') and conname = 'transactions_category_owner_kind_fkey' and confdeltype = 'r'), 'category deletion is restricted');
select ok(exists (select 1 from pg_indexes where schemaname = 'public' and tablename = 'transactions' and indexname = 'transactions_user_occurred_created_id_idx' and indexdef ~ '\(user_id, occurred_on DESC, created_at DESC, id DESC\)'), 'monthly stable-order index exists');
select ok(coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.transactions')), false), 'RLS is enabled');
select ok(coalesce((select relforcerowsecurity from pg_class where oid = to_regclass('public.transactions')), false), 'RLS is forced');
select is((select count(*) from pg_policies where schemaname = 'public' and tablename = 'transactions'), 2::bigint, 'exactly two policies exist');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transactions' and policyname = 'transactions_select_own' and cmd = 'SELECT' and roles = array['authenticated']::name[]), 'select policy targets authenticated');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transactions' and policyname = 'transactions_insert_own' and cmd = 'INSERT' and roles = array['authenticated']::name[]), 'insert policy targets authenticated');
select ok(not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transactions' and cmd in ('ALL', 'UPDATE', 'DELETE')), 'no broad or mutable policy exists');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transactions' and policyname = 'transactions_select_own' and qual ~ 'auth.uid' and qual ~ 'user_id' and qual ~ 'is_anonymous' and qual ~ 'false'), 'select policy enforces owner and permanent user');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transactions' and policyname = 'transactions_insert_own' and with_check ~ 'auth.uid' and with_check ~ 'user_id' and with_check ~ 'is_anonymous' and with_check ~ 'false'), 'insert policy enforces owner and permanent user');
select ok(case when to_regclass('public.transactions') is null then false else has_table_privilege('authenticated', 'public.transactions', 'SELECT') end, 'authenticated has select');
select ok(case when to_regclass('public.transactions') is null then false else has_table_privilege('authenticated', 'public.transactions', 'INSERT') end, 'authenticated has insert');
select ok(case when to_regclass('public.transactions') is null then false else not has_table_privilege('authenticated', 'public.transactions', 'UPDATE') end, 'authenticated has no update');
select ok(case when to_regclass('public.transactions') is null then false else not has_table_privilege('authenticated', 'public.transactions', 'DELETE') end, 'authenticated has no delete');
select ok(case when to_regclass('public.transactions') is null then false else not has_table_privilege('anon', 'public.transactions', 'SELECT') and not has_table_privilege('anon', 'public.transactions', 'INSERT') end, 'anon has no access');
select ok(case when to_regclass('public.transactions') is null then false else not has_table_privilege('service_role', 'public.transactions', 'SELECT') and not has_table_privilege('service_role', 'public.transactions', 'INSERT') end, 'service role has no explicit application privilege');
select ok(not exists (select 1 from pg_class as relation cross join lateral aclexplode(coalesce(relation.relacl, acldefault('r', relation.relowner))) as privilege where relation.oid = to_regclass('public.transactions') and privilege.grantee = 0 and privilege.privilege_type in ('SELECT', 'INSERT')), 'PUBLIC has no access');
select ok(not exists (select 1 from pg_publication_tables where schemaname = 'public' and tablename = 'transactions'), 'transactions is not published to Realtime');
select ok(not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'transactions' and column_name = 'status'), 'status is not anticipated');

select * from finish();
rollback;
