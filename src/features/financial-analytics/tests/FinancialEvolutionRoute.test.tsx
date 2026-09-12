import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FinancialPeriodKind } from "../domain/types/financial-period.types";

jest.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: jest.fn()
}));

const { createSupabaseServerClient } = jest.requireMock<
  typeof import("@/lib/supabase/server")
>("@/lib/supabase/server");
const { loadFinancialEvolution } = jest.requireActual<
  typeof import("@/app/(private)/dashboard/load-financial-evolution")
>("@/app/(private)/dashboard/load-financial-evolution");
const { default: DashboardLoading } = jest.requireActual<
  typeof import("@/app/(private)/dashboard/loading")
>("@/app/(private)/dashboard/loading");
const { default: DashboardError } = jest.requireActual<
  typeof import("@/app/(private)/dashboard/error")
>("@/app/(private)/dashboard/error");

describe("financial evolution server composition", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("authenticates the request and composes the use case with an explicit boundary", async () => {
    const rpc = jest.fn(async (
      functionName: string,
      parameters: Readonly<{ p_start_on: string; p_end_on: string }>
    ) => {
      void functionName;
      void parameters;

      return {
        data: [
          {
            account_count: 1,
            opening_balance_in_cents: "2500",
            movement_id: null,
            occurred_on: null,
            created_at: null,
            movement_type: null,
            amount_in_cents: null
          }
        ],
        error: null
      };
    });
    const getClaims = jest.fn(async () => ({
      data: { claims: { sub: " user-1 ", is_anonymous: false } },
      error: null
    }));
    jest.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: { getClaims },
      rpc
    } as never);

    const result = await loadFinancialEvolution({
      kind: "rolling_7_days",
      referenceInstant: "2026-03-07T15:00:00.000Z"
    });

    expect(getClaims).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith("load_financial_evolution_snapshot", {
      p_start_on: "2026-03-01",
      p_end_on: "2026-03-08"
    });
    expect(result).toEqual(expect.objectContaining({
      status: "empty",
      period: expect.objectContaining({ kind: "rolling_7_days" })
    }));
  });

  it("uses the aggregated RPC for a long civil period", async () => {
    const rpc = jest.fn(
      async (functionName: string, parameters: Record<string, string>) => {
        void functionName;
        void parameters;

        return {
          data: [
        {
          account_count: "1",
          start_on_inclusive: "2026-07-01",
          end_on_exclusive: "2026-10-01",
          open_in_cents: "10000",
          high_in_cents: "15000",
          low_in_cents: "10000",
          close_in_cents: "13000",
          income_in_cents: "5000",
          expense_in_cents: "2000",
          volume_in_cents: "7000",
          transaction_count: "2"
        }
          ],
          error: null
        };
      }
    );
    const getClaims = jest.fn(async () => ({
      data: { claims: { sub: " user-1 ", is_anonymous: false } },
      error: null
    }));
    jest.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: { getClaims },
      rpc
    } as never);

    const result = await loadFinancialEvolution({
      kind: "three_months" as FinancialPeriodKind,
      referenceInstant: "2026-09-06T15:00:00.000Z"
    });

    expect(rpc).toHaveBeenCalledWith("load_financial_evolution_buckets", {
      p_start_on: "2026-07-01",
      p_end_on: "2026-10-01",
      p_bucket: "week"
    });
    expect(result).toEqual(
      expect.objectContaining({
        status: "success",
        period: expect.objectContaining({
          kind: "three_months",
          bucketGranularity: "week"
        })
      })
    );
  });

  it("rejects an unauthenticated request before the financial query", async () => {
    const rpc = jest.fn();
    jest.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: {
        getClaims: jest.fn(async () => ({
          data: { claims: null },
          error: new Error("sensitive auth provider detail")
        }))
      },
      rpc
    } as never);

    await expect(
      loadFinancialEvolution({
        kind: "month",
        referenceInstant: "2026-03-07T15:00:00.000Z"
      })
    ).rejects.toThrow("authentication required");
    expect(rpc).not.toHaveBeenCalled();
  });
});

describe("dashboard route boundaries", () => {
  it("renders an accessible loading state", () => {
    render(<DashboardLoading />);

    expect(screen.getByRole("main")).toHaveClass("min-h-dvh");
    expect(
      screen.getByRole("heading", { name: "Visão geral", level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando evolução financeira..."
    );
  });

  it("renders a sanitized recoverable error state", async () => {
    const reset = jest.fn();
    const user = userEvent.setup();

    render(
      <DashboardError
        error={new Error("sensitive financial provider detail")}
        reset={reset}
      />
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute(
      "aria-labelledby",
      "dashboard-error-title"
    );
    expect(alert).toHaveAttribute(
      "aria-describedby",
      "dashboard-error-description"
    );
    expect(alert).toHaveTextContent(
      "Não foi possível carregar sua evolução financeira."
    );
    expect(
      screen.queryByText("sensitive financial provider detail")
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
