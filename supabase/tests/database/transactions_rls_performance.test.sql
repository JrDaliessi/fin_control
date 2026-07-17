begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(3);

select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transactions' and policyname = 'transactions_select_own' and qual ~ '\( SELECT auth\.uid\(\) AS uid\)' and qual ~ '\( SELECT auth\.jwt\(\) AS jwt\)'), 'select policy caches Auth helpers');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transactions' and policyname = 'transactions_insert_own' and with_check ~ '\( SELECT auth\.uid\(\) AS uid\)' and with_check ~ '\( SELECT auth\.jwt\(\) AS jwt\)'), 'insert policy caches Auth helpers');
select ok(exists (select 1 from pg_indexes where schemaname = 'public' and tablename = 'transactions' and indexname = 'transactions_user_occurred_created_id_idx' and indexdef ~ '\(user_id, occurred_on DESC, created_at DESC, id DESC\)'), 'owner and monthly order use one covering index');

select * from finish();
rollback;
