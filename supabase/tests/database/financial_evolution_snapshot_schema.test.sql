begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(15);

select ok(
  to_regprocedure('public.load_financial_evolution_snapshot(date,date)') is not null,
  'financial evolution snapshot function exists with civil boundaries'
);

select is(
  (
    select count(*)
    from pg_proc
    where pronamespace = 'public'::regnamespace
      and proname = 'load_financial_evolution_snapshot'
  ),
  1::bigint,
  'there is exactly one financial evolution snapshot overload'
);

select ok(
  not exists (
    select 1
    from pg_proc
    where oid = to_regprocedure('public.load_financial_evolution_snapshot(date,date)')
      and prosecdef
  ),
  'function uses security invoker'
);

select ok(
  exists (
    select 1
    from pg_proc
    where oid = to_regprocedure('public.load_financial_evolution_snapshot(date,date)')
      and proretset
  ),
  'function returns a set of snapshot rows'
);

select ok(
  exists (
    select 1
    from pg_proc
    where oid = to_regprocedure('public.load_financial_evolution_snapshot(date,date)')
      and array_to_string(proconfig, ',') ~ 'search_path='
  ),
  'function fixes its search path'
);

select is(
  (
    select string_agg(parameter_name || ':' || data_type, ',' order by ordinal_position)
    from information_schema.parameters
    where specific_schema = 'public'
      and specific_name like 'load_financial_evolution_snapshot_%'
      and parameter_mode = 'IN'
  ),
  'p_start_on:date,p_end_on:date',
  'function accepts only the two approved civil dates'
);

select is(
  (
    select string_agg(parameter_name, ',' order by ordinal_position)
    from information_schema.parameters
    where specific_schema = 'public'
      and specific_name like 'load_financial_evolution_snapshot_%'
      and parameter_mode = 'OUT'
  ),
  'account_count,opening_balance_in_cents,movement_id,occurred_on,created_at,movement_type,amount_in_cents',
  'function returns exactly the approved snapshot projection'
);

select ok(
  not exists (
    select 1
    from information_schema.parameters
    where specific_schema = 'public'
      and specific_name like 'load_financial_evolution_snapshot_%'
      and parameter_name in ('user_id', 'p_user_id')
  ),
  'function does not accept ownership from the caller'
);

select ok(
  case
    when to_regprocedure('public.load_financial_evolution_snapshot(date,date)') is null then false
    else has_function_privilege(
      'authenticated',
      'public.load_financial_evolution_snapshot(date,date)',
      'EXECUTE'
    )
  end,
  'authenticated can execute the function'
);

select ok(
  case
    when to_regprocedure('public.load_financial_evolution_snapshot(date,date)') is null then false
    else not has_function_privilege(
      'anon',
      'public.load_financial_evolution_snapshot(date,date)',
      'EXECUTE'
    )
  end,
  'anon cannot execute the function'
);

select ok(
  case
    when to_regprocedure('public.load_financial_evolution_snapshot(date,date)') is null then false
    else not has_function_privilege(
      'service_role',
      'public.load_financial_evolution_snapshot(date,date)',
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
    where function.oid = to_regprocedure('public.load_financial_evolution_snapshot(date,date)')
      and privilege.grantee = 0
      and privilege.privilege_type = 'EXECUTE'
  ),
  'PUBLIC cannot execute the function'
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
  'existing transaction index covers owner interval and stable order'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and indexname = 'financial_accounts_user_created_id_idx'
      and indexdef ~ '\(user_id, created_at DESC, id DESC\)'
  ),
  'existing account index starts with the RLS owner'
);

select is(
  (
    select count(*)
    from pg_indexes
    where schemaname = 'public'
      and indexname like 'financial_evolution%'
  ),
  0::bigint,
  'the snapshot does not require a feature-specific index'
);

select * from finish();
rollback;
