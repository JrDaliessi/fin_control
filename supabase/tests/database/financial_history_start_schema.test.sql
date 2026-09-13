begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(15);

select ok(
  to_regprocedure('public.load_financial_history_start()') is not null,
  'financial history start function exists without caller parameters'
);

select is(
  (
    select count(*)
    from pg_proc
    where pronamespace = 'public'::regnamespace
      and proname = 'load_financial_history_start'
  ),
  1::bigint,
  'there is exactly one financial history start overload'
);

select is(
  coalesce(
    (
      select pg_get_function_result(oid)
      from pg_proc
      where oid = to_regprocedure('public.load_financial_history_start()')
    ),
    ''
  ),
  'date',
  'function returns one nullable civil date'
);

select ok(
  coalesce(
    (
      select pronargs = 0
      from pg_proc
      where oid = to_regprocedure('public.load_financial_history_start()')
    ),
    false
  ),
  'function accepts no arguments'
);

select ok(
  coalesce(
    (
      select not proretset
      from pg_proc
      where oid = to_regprocedure('public.load_financial_history_start()')
    ),
    false
  ),
  'function returns one scalar value'
);

select ok(
  coalesce(
    (
      select not prosecdef
      from pg_proc
      where oid = to_regprocedure('public.load_financial_history_start()')
    ),
    false
  ),
  'function uses security invoker'
);

select ok(
  coalesce(
    (
      select array_to_string(proconfig, ',') ~ 'search_path='
      from pg_proc
      where oid = to_regprocedure('public.load_financial_history_start()')
    ),
    false
  ),
  'function fixes an empty search path'
);

select ok(
  not exists (
    select 1
    from information_schema.parameters
    where specific_schema = 'public'
      and specific_name like 'load_financial_history_start_%'
      and parameter_mode = 'IN'
  ),
  'function receives no ownership parameter'
);

select ok(
  case
    when to_regprocedure('public.load_financial_history_start()') is null then false
    else has_function_privilege(
      'authenticated',
      'public.load_financial_history_start()',
      'EXECUTE'
    )
  end,
  'authenticated can execute the function'
);

select ok(
  case
    when to_regprocedure('public.load_financial_history_start()') is null then false
    else not has_function_privilege(
      'anon',
      'public.load_financial_history_start()',
      'EXECUTE'
    )
  end,
  'anon cannot execute the function'
);

select ok(
  case
    when to_regprocedure('public.load_financial_history_start()') is null then false
    else not has_function_privilege(
      'service_role',
      'public.load_financial_history_start()',
      'EXECUTE'
    )
  end,
  'service role has no explicit application execute privilege'
);

select ok(
  not exists (
    select 1
    from pg_proc as function
    cross join lateral aclexplode(
      coalesce(function.proacl, acldefault('f', function.proowner))
    ) as privilege
    where function.oid = to_regprocedure('public.load_financial_history_start()')
      and privilege.grantee = 0
      and privilege.privilege_type = 'EXECUTE'
  ),
  'PUBLIC cannot execute the function'
);

select ok(
  coalesce(
    (
      select pg_get_functiondef(oid) ~ 'auth\.uid\(\)'
      from pg_proc
      where oid = to_regprocedure('public.load_financial_history_start()')
    ),
    false
  ),
  'function derives identity from auth uid'
);

select ok(
  coalesce(
    (
      select pg_get_functiondef(oid) ~ 'is_anonymous'
      from pg_proc
      where oid = to_regprocedure('public.load_financial_history_start()')
    ),
    false
  ),
  'function rejects anonymous Auth identities'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'transactions'
      and indexname = 'transactions_user_occurred_created_id_idx'
      and indexdef ~ '\(user_id, occurred_on DESC, created_at DESC, id DESC\)'
  ),
  'existing transaction index starts with owner and occurrence date'
);

select * from finish();
rollback;
