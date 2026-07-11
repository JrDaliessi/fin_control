export function formatMonthRef(monthRef: string) {
  const [year, month] = monthRef.split("-");

  return `${month}/${year}`;
}
