alter table public.financial_accounts
  add constraint financial_accounts_user_id_id_key unique (user_id, id);

alter table public.categories
  add constraint categories_user_id_id_kind_key unique (user_id, id, kind);

create table public.transactions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  account_id uuid not null,
  category_id uuid not null,
  description text not null,
  amount_in_cents bigint not null,
  type text not null,
  payment_method text not null default 'manual'::text,
  occurred_on date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_pkey primary key (id),
  constraint transactions_user_id_fkey
    foreign key (user_id) references auth.users (id) on delete cascade,
  constraint transactions_account_owner_fkey
    foreign key (user_id, account_id)
    references public.financial_accounts (user_id, id)
    on delete restrict,
  constraint transactions_category_owner_kind_fkey
    foreign key (user_id, category_id, type)
    references public.categories (user_id, id, kind)
    on delete restrict,
  constraint transactions_description_check
    check (
      char_length(description) between 1 and 160
      and description = btrim(description)
    ),
  constraint transactions_amount_in_cents_check
    check (amount_in_cents between 1 and 9007199254740991),
  constraint transactions_type_check
    check (type in ('income', 'expense')),
  constraint transactions_payment_method_check
    check (payment_method in ('manual', 'pix', 'cash', 'debit')),
  constraint transactions_notes_check
    check (
      notes is null
      or (
        char_length(notes) between 1 and 1000
        and notes = btrim(notes)
      )
    )
);

create index transactions_user_occurred_created_id_idx
  on public.transactions (user_id, occurred_on desc, created_at desc, id desc);

alter table public.transactions enable row level security;
alter table public.transactions force row level security;

revoke all on table public.transactions
  from public, anon, authenticated, service_role;
grant select, insert on table public.transactions to authenticated;

create policy transactions_select_own
  on public.transactions
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(
      ((select auth.jwt()) ->> 'is_anonymous')::boolean,
      false
    ) = false
  );

create policy transactions_insert_own
  on public.transactions
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and coalesce(
      ((select auth.jwt()) ->> 'is_anonymous')::boolean,
      false
    ) = false
  );
