drop policy financial_accounts_select_own
  on public.financial_accounts;

create policy financial_accounts_select_own
  on public.financial_accounts
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    and coalesce(
      ((select auth.jwt()) ->> 'is_anonymous')::boolean,
      false
    ) = false
  );

drop policy financial_accounts_insert_own
  on public.financial_accounts;

create policy financial_accounts_insert_own
  on public.financial_accounts
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and coalesce(
      ((select auth.jwt()) ->> 'is_anonymous')::boolean,
      false
    ) = false
  );
