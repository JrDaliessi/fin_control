begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(16);

select ok(
  to_regprocedure('public.load_financial_evolution_buckets(date,date,text)') is not null,
  'financial evolution bucket function exists with the approved signature'
);

select is(
  (
    select count(*)
    from pg_proc
    where pronamespace = 'public'::regnamespace
      and proname = 'load_financial_evolution_buckets'
  ),
  1::bigint,
  'there is exactly one financial evolution bucket overload'
);

select ok(
  not exists (
    select 1
    from pg_proc
    where oid = to_regprocedure('public.load_financial_evolution_buckets(date,date,text)')
      and prosecdef
  ),
  'function uses security invoker'
);

select ok(
  exists (
    select 1
    from pg_proc
    where oid = to_regprocedure('public.load_financial_evolution_buckets(date,date,text)')
      and proretset
  ),
  'function returns a set of aggregate rows'
);

select ok(
  exists (
    select 1
    from pg_proc
    where oid = to_regprocedure('public.load_financial_evolution_buckets(date,date,text)')
      and array_to_string(proconfig, ',') ~ 'search_path='
  ),
  'function fixes its search path'
);

select is(
  (
    select string_agg(parameter_name || ':' || data_type, ',' order by ordinal_position)
    from information_schema.parameters
    where specific_schema = 'public'
      and specific_name like 'load_financial_evolution_buckets_%'
      and parameter_mode = 'IN'
  ),
  'p_start_on:date,p_end_on:date,p_bucket:text',
  'function accepts only boundaries and one closed bucket value'
);

select is(
  (
    select string_agg(parameter_name, ',' order by ordinal_position)
    from information_schema.parameters
    where specific_schema = 'public'
      and specific_name like 'load_financial_evolution_buckets_%'
      and parameter_mode = 'OUT'
  ),
  'account_count,start_on_inclusive,end_on_exclusive,open_in_cents,high_in_cents,low_in_cents,close_in_cents,income_in_cents,expense_in_cents,volume_in_cents,transaction_count',
  'function returns exactly the approved aggregate projection'
);

select ok(
  not exists (
    select 1
    from information_schema.parameters
    where specific_schema = 'public'
      and specific_name like 'load_financial_evolution_buckets_%'
      and parameter_name in ('user_id', 'p_user_id')
  ),
  'function does not accept ownership from the caller'
);

select ok(
  case
    when to_regprocedure('public.load_financial_evolution_buckets(date,date,text)') is null then false
    else has_function_privilege(
      'authenticated',
      'public.load_financial_evolution_buckets(date,date,text)',
      'EXECUTE'
    )
  end,
  'authenticated can execute the function'
);

select ok(
  case
    when to_regprocedure('public.load_financial_evolution_buckets(date,date,text)') is null then false
    else not has_function_privilege(
      'anon',
      'public.load_financial_evolution_buckets(date,date,text)',
      'EXECUTE'
    )
  end,
  'anon cannot execute the function'
);

select ok(
  case
    when to_regprocedure('public.load_financial_evolution_buckets(date,date,text)') is null then false
    else not has_function_privilege(
      'service_role',
      'public.load_financial_evolution_buckets(date,date,text)',
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
    where function.oid = to_regprocedure('public.load_financial_evolution_buckets(date,date,text)')
      and privilege.grantee = 0
      and privilege.privilege_type = 'EXECUTE'
  ),
  'PUBLIC cannot execute the function'
);

select ok(
  coalesce(
    (
      select pg_get_functiondef(oid) ~ 'auth\.uid\(\)'
        and pg_get_functiondef(oid) ~ 'is_anonymous'
      from pg_proc
      where oid = to_regprocedure('public.load_financial_evolution_buckets(date,date,text)')
    ),
    false
  ),
  'function validates permanent authenticated identity'
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

select is(
  (
    select count(*)
    from pg_indexes
    where schemaname = 'public'
      and indexname like 'financial_evolution_bucket%'
  ),
  0::bigint,
  'no speculative feature-specific index is introduced'
);

select ok(
  coalesce(
    (
      select pg_get_functiondef(oid) ~ '366'
        and pg_get_functiondef(oid) ~ '60'
        and pg_get_functiondef(oid) ~ 'week'
        and pg_get_functiondef(oid) ~ 'month'
      from pg_proc
      where oid = to_regprocedure('public.load_financial_evolution_buckets(date,date,text)')
    ),
    false
  ),
  'function contains explicit duration, point and bucket allowlist limits'
);

select * from finish();
rollback;
