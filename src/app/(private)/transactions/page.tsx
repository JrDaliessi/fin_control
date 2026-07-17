import { TransactionsPage } from "@/features/transactions/presentation/pages/TransactionsPage";
import {
  createTransactionAction,
  loadTransactionsPageAction
} from "./actions";

export const dynamic = "force-dynamic";

export default async function TransactionsRoutePage() {
  const now = new Date();
  const monthRef = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  const initialData = await loadTransactionsPageAction({ monthRef });

  return (
    <TransactionsPage
      initialData={initialData}
      onCreateTransaction={createTransactionAction}
    />
  );
}
