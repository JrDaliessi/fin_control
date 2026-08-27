import { TransactionsPage } from "@/features/transactions/presentation/pages/TransactionsPage";
import {
  createTransactionAction,
  loadTransactionsPageAction
} from "./actions";
import { resolveDefaultTransactionMonthRef } from "./resolve-default-transaction-month";

export const dynamic = "force-dynamic";

export default async function TransactionsRoutePage() {
  const monthRef = resolveDefaultTransactionMonthRef(
    new Date().toISOString()
  );
  const initialData = await loadTransactionsPageAction({ monthRef });

  return (
    <TransactionsPage
      initialData={initialData}
      onCreateTransaction={createTransactionAction}
    />
  );
}
