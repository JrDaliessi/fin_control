import { AccountsPage } from "@/features/accounts/presentation/pages/AccountsPage";
import { createAccountAction, listAccountsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AccountsRoutePage() {
  const accounts = await listAccountsAction();

  return (
    <AccountsPage
      initialAccounts={accounts}
      onCreateAccount={createAccountAction}
    />
  );
}
