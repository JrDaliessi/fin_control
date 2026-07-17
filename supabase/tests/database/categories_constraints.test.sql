begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(12);

select set_config('test.user_a_id', gen_random_uuid()::text, true);
select set_config('test.user_b_id', gen_random_uuid()::text, true);

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
  false,
  now(),
  now()
from (
  values
    (current_setting('test.user_a_id')::uuid),
    (current_setting('test.user_b_id')::uuid)
) as fixture(id);

select lives_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, 'Alimentação', 'expense')$$,
  'an expense category is accepted'
);

select lives_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, 'Salário', 'income')$$,
  'an income category is accepted'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, '', 'expense')$$,
  '23514', null, 'an empty name is rejected'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, ' Padded ', 'expense')$$,
  '23514', null, 'a non-trimmed name is rejected'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, 'Duas  palavras', 'expense')$$,
  '23514', null, 'repeated whitespace is rejected'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, repeat('a', 81), 'expense')$$,
  '23514', null, 'a name longer than 80 characters is rejected'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, 'Híbrida', 'both')$$,
  '23514', null, 'an unsupported kind is rejected'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (gen_random_uuid(), 'Usuário ausente', 'expense')$$,
  '23503', null, 'a missing auth user is rejected by the foreign key'
);

select throws_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, 'alimentação', 'expense')$$,
  '23505', null, 'the same name and kind are unique case-insensitively per user'
);

select lives_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_a_id')::uuid, 'Alimentação', 'income')$$,
  'the same name is allowed for a different kind'
);

select lives_ok(
  $$insert into public.categories (user_id, name, kind)
    values (current_setting('test.user_b_id')::uuid, 'Alimentação', 'expense')$$,
  'the same name and kind are allowed for another user'
);

select ok(
  exists (
    select 1
    from public.categories
    where user_id = current_setting('test.user_a_id')::uuid
      and name = 'Salário'
      and id is not null
      and created_at is not null
      and updated_at is not null
  ),
  'database defaults populate id and timestamps'
);

select * from finish();
rollback;
