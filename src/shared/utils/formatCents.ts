const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency"
});

export function formatCents(amountInCents: number) {
  return currencyFormatter.format(amountInCents / 100);
}
