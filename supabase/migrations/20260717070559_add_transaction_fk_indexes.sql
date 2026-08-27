create index transactions_user_account_id_idx
  on public.transactions (user_id, account_id);

create index transactions_user_category_type_idx
  on public.transactions (user_id, category_id, type);
