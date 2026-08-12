export function formatCompactCount(value: number): string {
  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);

  if (absoluteValue < 1000) {
    return String(value);
  }

  const suffix = absoluteValue < 1_000_000 ? "k" : "m";
  const divisor = suffix === "k" ? 1000 : 1_000_000;
  const compactValue = absoluteValue / divisor;

  let decimals = 2;
  if (compactValue >= 100) {
    decimals = 0;
  } else if (compactValue >= 10) {
    decimals = 1;
  }

  const roundedValue = Number.parseFloat(compactValue.toFixed(decimals)).toString();

  return `${sign}${roundedValue} ${suffix}`;
}
