const formatter = new Intl.NumberFormat();

export function formatCount(value: number): string {
  return formatter.format(value);
}
