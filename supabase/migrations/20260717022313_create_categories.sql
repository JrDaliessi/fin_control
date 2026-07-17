create table public.categories (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  kind text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_pkey primary key (id),
  constraint categories_user_id_fkey
    foreign key (user_id) references auth.users (id) on delete cascade,
  constraint categories_name_check
    check (
      char_length(name) between 1 and 80
      and name = regexp_replace(btrim(name), '[[:space:]]+', ' ', 'g')
    ),
  constraint categories_kind_check
    check (kind in ('income', 'expense')),
  constraint categories_user_id_id_key unique (user_id, id)
);

create unique index categories_user_kind_name_ci_uidx
  on public.categories (user_id, kind, lower(name));

create index categories_user_kind_name_id_idx
  on public.categories (user_id, kind, name, id);

alter table public.categories enable row level security;
alter table public.categories force row level security;

revoke all on table public.categories
  from public, anon, authenticated, service_role;
grant select, insert on table public.categories to authenticated;

create policy categories_select_own
  on public.categories
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(
      ((select auth.jwt()) ->> 'is_anonymous')::boolean,
      false
    ) = false
  );

create policy categories_insert_own
  on public.categories
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and coalesce(
      ((select auth.jwt()) ->> 'is_anonymous')::boolean,
      false
    ) = false
  );
