begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(2);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and policyname = 'financial_accounts_select_own'
      and qual ~ '\( SELECT auth\.jwt\(\) AS jwt\)'
  ),
  'select policy caches auth.jwt once per statement'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'financial_accounts'
      and policyname = 'financial_accounts_insert_own'
      and with_check ~ '\( SELECT auth\.jwt\(\) AS jwt\)'
  ),
  'insert policy caches auth.jwt once per statement'
);

select * from finish();
rollback;
