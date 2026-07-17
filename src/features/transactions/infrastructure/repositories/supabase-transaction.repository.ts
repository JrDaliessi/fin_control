import type { Transaction } from "../../domain/entities/transaction.entity";
import type {
  FindTransactionsByMonthInput,
  TransactionRepository
} from "../../domain/interfaces/transaction.repository";
import {
  mapTransactionRowToDomain,
  mapTransactionToInsert,
  type TransactionInsert,
  type TransactionRow
} from "../supabase/transaction.mapper";

type SupabaseResult<T> = {
  data: T | null;
  error: unknown;
};

const transactionColumns =
  "id,user_id,account_id,category_id,description,amount_in_cents,type,payment_method,occurred_on,notes,created_at,updated_at";

type CreateQueryBuilder = {
  insert(input: TransactionInsert): {
    select(columns: typeof transactionColumns): {
      single(): Promise<SupabaseResult<TransactionRow>>;
    };
  };
};

type ListQueryBuilder = {
  select(columns: typeof transactionColumns): {
    eq(column: "user_id", value: string): {
      gte(column: "occurred_on", value: string): {
        lt(column: "occurred_on", value: string): {
          order(column: "occurred_on", options: { ascending: false }): {
            order(column: "created_at", options: { ascending: false }): {
              order(
                column: "id",
                options: { ascending: false }
              ): Promise<SupabaseResult<readonly TransactionRow[]>>;
            };
          };
        };
      };
    };
  };
};

type SupabaseTransactionClient = {
  from(table: string): unknown;
};

type SupabaseTransactionRepositoryDependencies = {
  supabaseClient: SupabaseTransactionClient;
};

const repositoryErrorMessage = "transaction repository unavailable";

function monthBoundary(year: number, month: number): string {
  return `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-01`;
}

function nextMonthBoundary(year: number, month: number): string {
  return month === 12
    ? monthBoundary(year + 1, 1)
    : monthBoundary(year, month + 1);
}

export class SupabaseTransactionRepository implements TransactionRepository {
  private readonly supabaseClient: SupabaseTransactionClient;

  constructor({ supabaseClient }: SupabaseTransactionRepositoryDependencies) {
    this.supabaseClient = supabaseClient;
  }

  async create(transaction: Transaction): Promise<Transaction> {
    try {
      const table = this.supabaseClient.from("transactions") as CreateQueryBuilder;
      const { data, error } = await table
        .insert(mapTransactionToInsert(transaction))
        .select(transactionColumns)
        .single();

      if (error || !data) {
        throw new Error(repositoryErrorMessage);
      }

      return mapTransactionRowToDomain(data);
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }

  async findByMonth(
    input: FindTransactionsByMonthInput
  ): Promise<Transaction[]> {
    try {
      const table = this.supabaseClient.from("transactions") as ListQueryBuilder;
      const { data, error } = await table
        .select(transactionColumns)
        .eq("user_id", input.userId)
        .gte("occurred_on", monthBoundary(input.year, input.month))
        .lt("occurred_on", nextMonthBoundary(input.year, input.month))
        .order("occurred_on", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

      if (error || !data) {
        throw new Error(repositoryErrorMessage);
      }

      return data.map(mapTransactionRowToDomain);
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }
}
