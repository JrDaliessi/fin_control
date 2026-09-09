import { FeedbackMessage } from "@/shared/components/ui/FeedbackMessage";
import { FinancialPeriodSelector } from "./FinancialPeriodSelector";

type FinancialPeriodSelectionErrorProps = Readonly<{
  reason: "CUSTOM_DATES_REQUIRED" | "CUSTOM_DATES_INVALID";
}>;

const errorMessages: Record<
  FinancialPeriodSelectionErrorProps["reason"],
  string
> = {
  CUSTOM_DATES_REQUIRED:
    "Informe as datas inicial e final para analisar o período personalizado.",
  CUSTOM_DATES_INVALID:
    "Revise as datas do período personalizado e tente novamente."
};

export function FinancialPeriodSelectionError({
  reason
}: FinancialPeriodSelectionErrorProps) {
  return (
    <section
      aria-labelledby="financial-evolution-title"
      className="mb-8 grid gap-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold text-foreground sm:text-2xl"
            id="financial-evolution-title"
          >
            Como seu dinheiro evoluiu
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha um intervalo válido para consultar sua evolução financeira.
          </p>
        </div>
        <FinancialPeriodSelector selectedPeriodKind="custom" />
      </div>

      <FeedbackMessage variant="error">{errorMessages[reason]}</FeedbackMessage>
    </section>
  );
}
