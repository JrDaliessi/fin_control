begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(12);

select has_schema(
  'private',
  'private schema exists for administrative functions'
);

select has_function(
  'private',
  'reset_recruiter_demo_data',
  array['date'],
  'reset function has the approved date signature'
);

select is(
  (
    select count(*)
    from pg_proc
    where pronamespace = to_regnamespace('private')
      and proname = 'reset_recruiter_demo_data'
  ),
  1::bigint,
  'reset function has no overloads'
);

select ok(
  coalesce((
    select prorettype = 'pg_catalog.void'::regtype
    from pg_proc
    where pronamespace = to_regnamespace('private')
      and proname = 'reset_recruiter_demo_data'
      and oidvectortypes(proargtypes) = 'date'
  ), false),
  'reset function returns void'
);

select ok(
  coalesce((
    select language.lanname = 'plpgsql'
    from pg_proc as function
    join pg_language as language on language.oid = function.prolang
    where function.pronamespace = to_regnamespace('private')
      and function.proname = 'reset_recruiter_demo_data'
      and oidvectortypes(function.proargtypes) = 'date'
  ), false),
  'reset function uses plpgsql'
);

select ok(
  coalesce((
    select function.prosecdef = false
    from pg_proc as function
    where function.pronamespace = to_regnamespace('private')
      and function.proname = 'reset_recruiter_demo_data'
      and oidvectortypes(function.proargtypes) = 'date'
  ), false),
  'reset function is SECURITY INVOKER'
);

select ok(
  coalesce((
    select pg_get_userbyid(function.proowner) = 'postgres'
    from pg_proc as function
    where function.pronamespace = to_regnamespace('private')
      and function.proname = 'reset_recruiter_demo_data'
      and oidvectortypes(function.proargtypes) = 'date'
  ), false),
  'reset function is owned by postgres'
);

select ok(
  coalesce((
    select exists (
      select 1
      from unnest(function.proconfig) as setting
      where setting ~ '^search_path=(""|)$'
    )
    from pg_proc as function
    where function.pronamespace = to_regnamespace('private')
      and function.proname = 'reset_recruiter_demo_data'
      and oidvectortypes(function.proargtypes) = 'date'
  ), false),
  'reset function pins an empty search_path'
);

select ok(
  coalesce((
    select not exists (
      select 1
      from aclexplode(
        coalesce(function.proacl, acldefault('f', function.proowner))
      ) as privilege
      where privilege.grantee = 0
        and privilege.privilege_type = 'EXECUTE'
    )
    from pg_proc as function
    where function.pronamespace = to_regnamespace('private')
      and function.proname = 'reset_recruiter_demo_data'
      and oidvectortypes(function.proargtypes) = 'date'
  ), false),
  'PUBLIC cannot execute the reset function'
);

select ok(
  coalesce((
    select bool_and(
      not has_function_privilege(role.oid, function.oid, 'EXECUTE')
    )
    from pg_proc as function
    cross join pg_roles as role
    where function.pronamespace = to_regnamespace('private')
      and function.proname = 'reset_recruiter_demo_data'
      and oidvectortypes(function.proargtypes) = 'date'
      and role.rolname in ('anon', 'authenticated', 'service_role')
  ), false),
  'application roles cannot execute the reset function'
);

select ok(
  coalesce((
    select bool_and(
      not has_schema_privilege(role.oid, namespace.oid, 'USAGE')
    )
    from pg_namespace as namespace
    cross join pg_roles as role
    where namespace.nspname = 'private'
      and role.rolname in ('anon', 'authenticated', 'service_role')
  ), false),
  'application roles cannot use the private schema'
);

select ok(
  coalesce((
    select has_function_privilege('postgres', function.oid, 'EXECUTE')
    from pg_proc as function
    where function.pronamespace = to_regnamespace('private')
      and function.proname = 'reset_recruiter_demo_data'
      and oidvectortypes(function.proargtypes) = 'date'
  ), false),
  'postgres can execute the reset function'
);

select * from finish();
rollback;
