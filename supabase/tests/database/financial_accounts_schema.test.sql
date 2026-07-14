begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(38);

select has_table(
  'public',
  'financial_accounts',
  'financial_accounts table exists'
);

select is(
  (
    select count(*)
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
  ),
  8::bigint,
  'financial_accounts has exactly the approved columns'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'id'
      and data_type = 'uuid'
  ),
  'id is uuid'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'id'
      and is_nullable = 'NO'
  ),
  'id is not null'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'id'
      and column_default ~ 'gen_random_uuid'
  ),
  'id defaults to gen_random_uuid'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.financial_accounts')
      and contype = 'p'
      and conname = 'financial_accounts_pkey'
  ),
  'id is the primary key'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'user_id'
      and data_type = 'uuid'
      and is_nullable = 'NO'
  ),
  'user_id is a required uuid'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.financial_accounts')
      and confrelid = 'auth.users'::regclass
      and contype = 'f'
      and conname = 'financial_accounts_user_id_fkey'
  ),
  'user_id references auth.users'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.financial_accounts')
      and conname = 'financial_accounts_user_id_fkey'
      and confdeltype = 'c'
  ),
  'auth user deletion cascades to financial accounts'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'name'
      and data_type = 'text'
      and is_nullable = 'NO'
  ),
  'name is required text'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'type'
      and data_type = 'text'
      and is_nullable = 'NO'
  ),
  'type is required text'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'initial_balance_in_cents'
      and data_type = 'bigint'
      and is_nullable = 'NO'
  ),
  'initial balance is required bigint'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'currency'
      and data_type = 'text'
      and is_nullable = 'NO'
  ),
  'currency is required text'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'currency'
      and column_default = '''BRL''::text'
  ),
  'currency defaults to BRL'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'created_at'
      and data_type = 'timestamp with time zone'
      and is_nullable = 'NO'
      and column_default ~ 'now\(\)'
  ),
  'created_at is required timestamptz with now default'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'updated_at'
      and data_type = 'timestamp with time zone'
      and is_nullable = 'NO'
      and column_default ~ 'now\(\)'
  ),
  'updated_at is required timestamptz with now default'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.financial_accounts')
      and conname = 'financial_accounts_name_check'
      and contype = 'c'
  ),
  'name check constraint exists'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.financial_accounts')
      and conname = 'financial_accounts_type_check'
      and contype = 'c'
  ),
  'type check constraint exists'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.financial_accounts')
      and conname = 'financial_accounts_initial_balance_check'
      and contype = 'c'
  ),
  'initial balance check constraint exists'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.financial_accounts')
      and conname = 'financial_accounts_currency_check'
      and contype = 'c'
  ),
  'currency check constraint exists'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and indexname = 'financial_accounts_user_created_id_idx'
      and indexdef ~ '\(user_id, created_at DESC, id DESC\)$'
  ),
  'owner and deterministic listing index exists'
);

select ok(
  coalesce((
    select relrowsecurity
    from pg_class
    where oid = to_regclass('public.financial_accounts')
  ), false),
  'row level security is enabled'
);

select ok(
  coalesce((
    select relforcerowsecurity
    from pg_class
    where oid = to_regclass('public.financial_accounts')
  ), false),
  'row level security is forced'
);

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'financial_accounts'
  ),
  2::bigint,
  'financial_accounts has exactly two policies'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and policyname = 'financial_accounts_select_own'
      and cmd = 'SELECT'
      and roles = array['authenticated']::name[]
  ),
  'select policy targets authenticated users'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and policyname = 'financial_accounts_insert_own'
      and cmd = 'INSERT'
      and roles = array['authenticated']::name[]
  ),
  'insert policy targets authenticated users'
);

select ok(
  not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and cmd in ('ALL', 'UPDATE', 'DELETE')
  ),
  'no all, update or delete policy exists'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and policyname = 'financial_accounts_select_own'
      and qual ~ 'auth.uid'
      and qual ~ 'user_id'
      and qual ~ 'is_anonymous'
      and qual ~ 'false'
  ),
  'select policy enforces owner and blocks anonymous Auth users'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and policyname = 'financial_accounts_insert_own'
      and with_check ~ 'auth.uid'
      and with_check ~ 'user_id'
      and with_check ~ 'is_anonymous'
      and with_check ~ 'false'
  ),
  'insert policy enforces owner and blocks anonymous Auth users'
);

select ok(
  case when to_regclass('public.financial_accounts') is null then false
    else has_table_privilege('authenticated', 'public.financial_accounts', 'SELECT')
  end,
  'authenticated has select privilege'
);

select ok(
  case when to_regclass('public.financial_accounts') is null then false
    else has_table_privilege('authenticated', 'public.financial_accounts', 'INSERT')
  end,
  'authenticated has insert privilege'
);

select ok(
  case when to_regclass('public.financial_accounts') is null then false
    else not has_table_privilege('authenticated', 'public.financial_accounts', 'UPDATE')
  end,
  'authenticated has no update privilege'
);

select ok(
  case when to_regclass('public.financial_accounts') is null then false
    else not has_table_privilege('authenticated', 'public.financial_accounts', 'DELETE')
  end,
  'authenticated has no delete privilege'
);

select ok(
  case when to_regclass('public.financial_accounts') is null then false
    else not has_table_privilege('anon', 'public.financial_accounts', 'SELECT')
      and not has_table_privilege('anon', 'public.financial_accounts', 'INSERT')
  end,
  'anon has no select or insert privilege'
);

select ok(
  case when to_regclass('public.financial_accounts') is null then false
    else not has_table_privilege('service_role', 'public.financial_accounts', 'SELECT')
      and not has_table_privilege('service_role', 'public.financial_accounts', 'INSERT')
  end,
  'service_role has no explicit application privilege'
);

select ok(
  not exists (
    select 1
    from pg_class as relation
    cross join lateral aclexplode(
      coalesce(relation.relacl, acldefault('r', relation.relowner))
    ) as privilege
    where relation.oid = to_regclass('public.financial_accounts')
      and privilege.grantee = 0
      and privilege.privilege_type in ('SELECT', 'INSERT')
  ),
  'PUBLIC has no select or insert privilege'
);

select ok(
  not exists (
    select 1
    from pg_publication_tables
    where schemaname = 'public'
      and tablename = 'financial_accounts'
  ),
  'financial_accounts is not published to Realtime'
);

select ok(
  not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'financial_accounts'
      and column_name = 'current_balance'
  ),
  'current balance is not persisted'
);

select * from finish();
rollback;
