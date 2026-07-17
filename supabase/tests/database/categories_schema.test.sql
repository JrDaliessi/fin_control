begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(33);

select has_table('public', 'categories', 'categories table exists');

select is(
  (
    select count(*)
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
  ),
  6::bigint,
  'categories has exactly the approved columns'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'id'
      and data_type = 'uuid'
      and is_nullable = 'NO'
      and column_default ~ 'gen_random_uuid'
  ),
  'id is a required uuid with generated default'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.categories')
      and contype = 'p'
      and conname = 'categories_pkey'
  ),
  'id is the primary key'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
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
    where conrelid = to_regclass('public.categories')
      and confrelid = 'auth.users'::regclass
      and contype = 'f'
      and conname = 'categories_user_id_fkey'
  ),
  'user_id references auth.users'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.categories')
      and conname = 'categories_user_id_fkey'
      and confdeltype = 'c'
  ),
  'auth user deletion cascades to categories'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
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
      and table_name = 'categories'
      and column_name = 'kind'
      and data_type = 'text'
      and is_nullable = 'NO'
  ),
  'kind is required text'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
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
      and table_name = 'categories'
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
    where conrelid = to_regclass('public.categories')
      and conname = 'categories_name_check'
      and contype = 'c'
  ),
  'name check constraint exists'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.categories')
      and conname = 'categories_kind_check'
      and contype = 'c'
  ),
  'kind check constraint exists'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.categories')
      and conname = 'categories_user_id_id_key'
      and contype = 'u'
  ),
  'tenant-safe composite key exists for future references'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'categories'
      and indexname = 'categories_user_kind_name_ci_uidx'
      and indexdef ~ '^CREATE UNIQUE INDEX'
      and indexdef ~ 'lower\(name\)'
  ),
  'case-insensitive owner, kind and name uniqueness exists'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'categories'
      and indexname = 'categories_user_kind_name_id_idx'
      and indexdef ~ '\(user_id, kind, name, id\)$'
  ),
  'deterministic listing index exists'
);

select ok(
  coalesce((
    select relrowsecurity
    from pg_class
    where oid = to_regclass('public.categories')
  ), false),
  'row level security is enabled'
);

select ok(
  coalesce((
    select relforcerowsecurity
    from pg_class
    where oid = to_regclass('public.categories')
  ), false),
  'row level security is forced'
);

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'categories'
  ),
  2::bigint,
  'categories has exactly two policies'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'categories'
      and policyname = 'categories_select_own'
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
      and tablename = 'categories'
      and policyname = 'categories_insert_own'
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
      and tablename = 'categories'
      and cmd in ('ALL', 'UPDATE', 'DELETE')
  ),
  'no all, update or delete policy exists'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'categories'
      and policyname = 'categories_select_own'
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
      and tablename = 'categories'
      and policyname = 'categories_insert_own'
      and with_check ~ 'auth.uid'
      and with_check ~ 'user_id'
      and with_check ~ 'is_anonymous'
      and with_check ~ 'false'
  ),
  'insert policy enforces owner and blocks anonymous Auth users'
);

select ok(
  case when to_regclass('public.categories') is null then false
    else has_table_privilege('authenticated', 'public.categories', 'SELECT')
  end,
  'authenticated has select privilege'
);

select ok(
  case when to_regclass('public.categories') is null then false
    else has_table_privilege('authenticated', 'public.categories', 'INSERT')
  end,
  'authenticated has insert privilege'
);

select ok(
  case when to_regclass('public.categories') is null then false
    else not has_table_privilege('authenticated', 'public.categories', 'UPDATE')
  end,
  'authenticated has no update privilege'
);

select ok(
  case when to_regclass('public.categories') is null then false
    else not has_table_privilege('authenticated', 'public.categories', 'DELETE')
  end,
  'authenticated has no delete privilege'
);

select ok(
  case when to_regclass('public.categories') is null then false
    else not has_table_privilege('anon', 'public.categories', 'SELECT')
      and not has_table_privilege('anon', 'public.categories', 'INSERT')
  end,
  'anon has no select or insert privilege'
);

select ok(
  case when to_regclass('public.categories') is null then false
    else not has_table_privilege('service_role', 'public.categories', 'SELECT')
      and not has_table_privilege('service_role', 'public.categories', 'INSERT')
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
    where relation.oid = to_regclass('public.categories')
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
      and tablename = 'categories'
  ),
  'categories is not published to Realtime'
);

select ok(
  not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name in ('color', 'icon')
  ),
  'color and icon are not persisted in this release'
);

select * from finish();
rollback;
