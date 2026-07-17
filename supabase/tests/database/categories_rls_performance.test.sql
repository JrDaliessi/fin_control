begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(3);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'categories'
      and policyname = 'categories_select_own'
      and qual ~ '\( SELECT auth\.uid\(\) AS uid\)'
      and qual ~ '\( SELECT auth\.jwt\(\) AS jwt\)'
  ),
  'select policy caches auth helpers once per statement'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'categories'
      and policyname = 'categories_insert_own'
      and with_check ~ '\( SELECT auth\.uid\(\) AS uid\)'
      and with_check ~ '\( SELECT auth\.jwt\(\) AS jwt\)'
  ),
  'insert policy caches auth helpers once per statement'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'categories'
      and indexdef ~ '\(user_id,'
  ),
  'user_id used by RLS is indexed'
);

select * from finish();
rollback;
