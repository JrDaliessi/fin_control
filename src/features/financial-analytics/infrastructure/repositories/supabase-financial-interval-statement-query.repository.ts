import type {
  FinancialIntervalStatementItem,
  FinancialIntervalStatementQueryInput,
  FinancialIntervalStatementQueryRepository
} from "../../application/ports/financial-interval-statement-query.repository";

type FinancialIntervalStatementRow = Readonly<{
  id: string;
  description: string;
  amount_in_cents: number;
  type: "income" | "expense";
  occurred_on: string;
  created_at: string;
}>;

type SupabaseStatementResult = Readonly<{
  data: readonly FinancialIntervalStatementRow[] | null;
  error: unknown;
}>;

type OrderOptions = Readonly<{ ascending: boolean }>;
export type FinancialIntervalStatementSupabaseClient = Readonly<{
  from(table: "transactions"): {
    select(columns: string): {
      eq(column: "user_id", value: string): {
        gte(column: "occurred_on", value: string): {
          lt(column: "occurred_on", value: string): {
            order(column: "occurred_on", options: OrderOptions): {
              order(column: "created_at", options: OrderOptions): {
                order(
                  column: "id",
                  options: OrderOptions
                ): PromiseLike<SupabaseStatementResult>;
              };
            };
          };
        };
      };
    };
  };
}>;

type Dependencies = Readonly<{
  supabaseClient: FinancialIntervalStatementSupabaseClient;
}>;

const statementColumns =
  "id,description,amount_in_cents,type,occurred_on,created_at";
const repositoryErrorMessage =
  "financial interval statement repository unavailable";

function toStatementItem(
  row: FinancialIntervalStatementRow
): FinancialIntervalStatementItem {
  return {
    id: row.id,
    description: row.description,
    amountInCents: row.amount_in_cents,
    type: row.type,
    occurredOn: row.occurred_on,
    createdAt: row.created_at
  };
}

export class SupabaseFinancialIntervalStatementQueryRepository
  implements FinancialIntervalStatementQueryRepository
{
  private readonly supabaseClient: FinancialIntervalStatementSupabaseClient;

  constructor({ supabaseClient }: Dependencies) {
    this.supabaseClient = supabaseClient;
  }

  async listByInterval(
    input: FinancialIntervalStatementQueryInput
  ): Promise<readonly FinancialIntervalStatementItem[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from("transactions")
        .select(statementColumns)
        .eq("user_id", input.userId)
        .gte("occurred_on", input.startOnInclusive)
        .lt("occurred_on", input.endOnExclusive)
        .order("occurred_on", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

      if (error || !data) {
        throw new Error(repositoryErrorMessage);
      }

      return data.map(toStatementItem);
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }
}
