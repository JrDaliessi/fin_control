export function formatFinancialCivilDate(civilDate: string) {
  const [year, month, day] = civilDate.split("-");
  return `${day}/${month}/${year}`;
}

export function formatFinancialCivilDayMonth(civilDate: string) {
  const [, month, day] = civilDate.split("-");
  return `${day}/${month}`;
}
