create table public.financial_accounts (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  type text not null,
  initial_balance_in_cents bigint not null,
  currency text not null default 'BRL'::text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint financial_accounts_pkey primary key (id),
  constraint financial_accounts_user_id_fkey
    foreign key (user_id) references auth.users (id) on delete cascade,
  constraint financial_accounts_name_check
    check (name = btrim(name) and char_length(name) between 1 and 80),
  constraint financial_accounts_type_check
    check (type in ('checking', 'savings', 'cash', 'payment', 'investment')),
  constraint financial_accounts_initial_balance_check
    check (initial_balance_in_cents between -9007199254740991 and 9007199254740991),
  constraint financial_accounts_currency_check
    check (currency = 'BRL'::text)
);

create index financial_accounts_user_created_id_idx
  on public.financial_accounts (user_id, created_at desc, id desc);

alter table public.financial_accounts enable row level security;
alter table public.financial_accounts force row level security;

revoke all on table public.financial_accounts
  from public, anon, authenticated, service_role;
grant select, insert on table public.financial_accounts to authenticated;

create policy financial_accounts_select_own
  on public.financial_accounts
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(
      (select (auth.jwt() ->> 'is_anonymous')::boolean),
      false
    ) = false
  );

create policy financial_accounts_insert_own
  on public.financial_accounts
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and coalesce(
      (select (auth.jwt() ->> 'is_anonymous')::boolean),
      false
    ) = false
  );
