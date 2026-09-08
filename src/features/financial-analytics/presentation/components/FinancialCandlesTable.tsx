import type { FinancialCandle } from "../../domain/types/financial-evolution.types";
import type { FinancialBucketGranularity } from "../../domain/types/financial-period.types";
import { formatCents } from "@/shared/utils/formatCents";
import { getFinancialBucketCopy } from "../config/financial-bucket-copy";
import { formatFinancialCivilDate } from "../formatters/format-financial-civil-date";
import { handleHorizontalTableKeyDown } from "./horizontal-table-keyboard-scroll";

type FinancialCandlesTableProps = Readonly<{
  bucketGranularity?: FinancialBucketGranularity;
  candles: readonly FinancialCandle[];
  onSelectInterval?: (candle: FinancialCandle) => void;
}>;

function describeVariation(candle: FinancialCandle) {
  if (candle.closeInCents > candle.openInCents) {
    return "Alta";
  }

  if (candle.closeInCents < candle.openInCents) {
    return "Queda";
  }

  return "Estável";
}

export function FinancialCandlesTable({
  bucketGranularity = "day",
  candles,
  onSelectInterval
}: FinancialCandlesTableProps) {
  const bucketCopy = getFinancialBucketCopy(bucketGranularity);
  const headings = [
    bucketCopy.columnHeading,
    ...(onSelectInterval ? ["Extrato"] : []),
    "Abertura",
    "Máxima",
    "Mínima",
    "Fechamento",
    "Variação",
    "Volume",
    "Movimentos"
  ];

  return (
    <div className="grid gap-2">
      <p className="text-xs text-muted-foreground" id="financial-candles-order-note">
        As máximas e mínimas consideram a ordem de registro das movimentações.
      </p>
      <p
        className="text-xs text-muted-foreground sm:sr-only"
        id="financial-candles-table-hint"
      >
        Deslize horizontalmente ou use as setas do teclado para consultar todas
        as colunas.
      </p>
      <div
        aria-describedby="financial-candles-order-note financial-candles-table-hint"
        aria-label={`Variação financeira por ${bucketCopy.singular}`}
        className="touch-pan-x overflow-x-auto overscroll-x-contain rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
        onKeyDown={handleHorizontalTableKeyDown}
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-[64rem] border-collapse text-sm">
          <caption className="sr-only">
            Variação financeira por {bucketCopy.singular}
          </caption>
          <thead className="bg-surface-muted text-left text-muted-foreground">
            <tr>
              {headings.map((heading) => (
                <th className="px-4 py-3 font-semibold" key={heading} scope="col">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {candles.map((candle) => (
              <tr key={candle.startOnInclusive}>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                  {formatFinancialCivilDate(candle.startOnInclusive)}
                </td>
                {onSelectInterval ? (
                  <td className="px-4 py-3">
                    <button
                      aria-label={`Ver extrato de ${formatFinancialCivilDate(candle.startOnInclusive)}`}
                      className="min-h-11 whitespace-nowrap rounded-md border border-border px-3 py-2 font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                      onClick={() => onSelectInterval(candle)}
                      type="button"
                    >
                      Ver extrato
                    </button>
                  </td>
                ) : null}
                {[
                  candle.openInCents,
                  candle.highInCents,
                  candle.lowInCents,
                  candle.closeInCents
                ].map((value, index) => (
                  <td
                    className="whitespace-nowrap px-4 py-3 tabular-nums text-foreground"
                    key={index}
                  >
                    {formatCents(value)}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                  {describeVariation(candle)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-foreground">
                  {formatCents(candle.volumeInCents)}
                </td>
                <td className="px-4 py-3 tabular-nums text-foreground">
                  {candle.transactionCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
