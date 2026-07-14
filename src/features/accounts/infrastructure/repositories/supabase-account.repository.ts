import type { FinancialAccount } from "../../domain/entities/financial-account.entity";
import type {
  AccountListingRepository,
  AccountRepository,
  ListAccountsByUserInput
} from "../../domain/interfaces/account.repository";
import {
  mapFinancialAccountRowToDomain,
  mapFinancialAccountToInsert,
  type FinancialAccountInsert,
  type FinancialAccountRow
} from "../supabase/financial-account.mapper";

type SupabaseResult<T> = {
  data: T | null;
  error: unknown;
};

type CreateQueryBuilder = {
  insert(input: FinancialAccountInsert): {
    select(columns: "*"): {
      single(): Promise<SupabaseResult<FinancialAccountRow>>;
    };
  };
};

type ListQueryBuilder = {
  select(columns: "*"): {
    eq(column: "user_id", value: string): {
      order(column: "created_at", options: { ascending: false }): {
        order(
          column: "id",
          options: { ascending: false }
        ): Promise<SupabaseResult<readonly FinancialAccountRow[]>>;
      };
    };
  };
};

type SupabaseAccountClient = {
  from(table: string): unknown;
};

type SupabaseAccountRepositoryDependencies = {
  supabaseClient: SupabaseAccountClient;
};

const repositoryErrorMessage = "account repository unavailable";

export class SupabaseAccountRepository
  implements AccountRepository, AccountListingRepository
{
  private readonly supabaseClient: SupabaseAccountClient;

  constructor({ supabaseClient }: SupabaseAccountRepositoryDependencies) {
    this.supabaseClient = supabaseClient;
  }

  async create(input: FinancialAccount): Promise<FinancialAccount> {
    try {
      const table = this.supabaseClient.from(
        "financial_accounts"
      ) as CreateQueryBuilder;
      const { data, error } = await table
        .insert(mapFinancialAccountToInsert(input))
        .select("*")
        .single();

      if (error || !data) {
        throw new Error(repositoryErrorMessage);
      }

      return mapFinancialAccountRowToDomain(data);
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }

  async listByUser(
    input: ListAccountsByUserInput
  ): Promise<readonly FinancialAccount[]> {
    try {
      const table = this.supabaseClient.from(
        "financial_accounts"
      ) as ListQueryBuilder;
      const { data, error } = await table
        .select("*")
        .eq("user_id", input.userId)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

      if (error || !data) {
        throw new Error(repositoryErrorMessage);
      }

      return data.map(mapFinancialAccountRowToDomain);
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }
}
