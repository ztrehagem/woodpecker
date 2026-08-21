const formatter = new Intl.NumberFormat("en-US");

export function formatCount(value: number): string {
  return formatter.format(value);
}
