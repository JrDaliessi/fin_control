begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(17);

select set_config('test.user_a_id', gen_random_uuid()::text, true);
select set_config('test.user_b_id', gen_random_uuid()::text, true);
select set_config('test.anonymous_user_id', gen_random_uuid()::text, true);

insert into auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data,
  is_anonymous, created_at, updated_at
)
select
  fixture.id,
  'authenticated',
  'authenticated',
  fixture.id::text || '@example.invalid',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  fixture.is_anonymous,
  now(),
  now()
from (
  values
    (current_setting('test.user_a_id')::uuid, false),
    (current_setting('test.user_b_id')::uuid, false),
    (current_setting('test.anonymous_user_id')::uuid, true)
) as fixture(id, is_anonymous);

insert into public.categories (user_id, name, kind)
values
  (current_setting('test.user_a_id')::uuid, 'Categoria A', 'expense'),
  (current_setting('test.user_b_id')::uuid, 'Categoria B', 'income'),
  (current_setting('test.anonymous_user_id')::uuid, 'Categoria anônima', 'expense');

select set_config('request.jwt.claim.sub', current_setting('test.user_a_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.user_a_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

select is(auth.uid(), current_setting('test.user_a_id')::uuid, 'user A identity is active');

select results_eq(
  $$select count(*)::bigint from public.categories$$,
  $$values (1::bigint)$$,
  'user A sees only the owned category'
);

select results_eq(
  $$select count(*)::bigint from public.categories
    where user_id = current_setting('test.user_b_id')::uuid$$,
  $$values (0::bigint)$$,
  'user A cannot see user B categories'
);

select lives_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, 'Nova categoria A', 'expense')$$,
  'user A inserts an owned category'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_b_id')::uuid, 'Categoria forjada', 'expense')$$,
  '42501', null, 'user A cannot insert for user B'
);

select throws_ok(
  $$update public.categories set name = 'Alterada'
    where user_id = current_setting('test.user_a_id')::uuid$$,
  '42501', null, 'authenticated users have no update privilege'
);

select throws_ok(
  $$delete from public.categories
    where user_id = current_setting('test.user_a_id')::uuid$$,
  '42501', null, 'authenticated users have no delete privilege'
);

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.user_b_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.user_b_id'),
    'role', 'authenticated',
    'is_anonymous', false
  )::text,
  true
);
set local role authenticated;

select is(auth.uid(), current_setting('test.user_b_id')::uuid, 'user B identity is active');

select results_eq(
  $$select count(*)::bigint from public.categories$$,
  $$values (1::bigint)$$,
  'user B sees only the owned category'
);

select results_eq(
  $$select count(*)::bigint from public.categories
    where user_id = current_setting('test.user_a_id')::uuid$$,
  $$values (0::bigint)$$,
  'user B cannot query user A by owner id'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, 'Categoria forjada B', 'income')$$,
  '42501', null, 'user B cannot insert for user A'
);

reset role;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000000', true);
select set_config('request.jwt.claims', '{}', true);
set local role anon;

select throws_ok(
  $$select * from public.categories$$,
  '42501', null, 'anon cannot select categories'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (gen_random_uuid(), 'Categoria anon', 'expense')$$,
  '42501', null, 'anon cannot insert categories'
);

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.anonymous_user_id'), true);
select set_config(
  'request.jwt.claims',
  jsonb_build_object(
    'sub', current_setting('test.anonymous_user_id'),
    'role', 'authenticated',
    'is_anonymous', true
  )::text,
  true
);
set local role authenticated;

select is(
  auth.uid(),
  current_setting('test.anonymous_user_id')::uuid,
  'anonymous Auth user identity is active'
);

select is(
  (auth.jwt() ->> 'is_anonymous')::boolean,
  true,
  'anonymous Auth claim is active'
);

select results_eq(
  $$select count(*)::bigint from public.categories$$,
  $$values (0::bigint)$$,
  'anonymous Auth user cannot see even an owned fixture'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.anonymous_user_id')::uuid, 'Nova categoria anônima', 'expense')$$,
  '42501', null, 'anonymous Auth user cannot insert an owned category'
);

reset role;
select * from finish();
rollback;
