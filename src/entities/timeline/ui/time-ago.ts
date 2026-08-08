export function timeAgo(date: Date, locale: Intl.LocalesArgument = navigator.languages): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
  ] as const;

  for (const unit of units) {
    if (Math.abs(diffInSeconds) >= unit.seconds) {
      const value = Math.round(diffInSeconds / unit.seconds);
      return rtf.format(value, unit.name);
    }
  }

  return rtf.format(diffInSeconds, "second");
}
