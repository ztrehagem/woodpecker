export function fallbackDisplayName(
  displayName: string | null | undefined,
  handle: string,
): string {
  return displayName == null || displayName === "" ? handle : displayName;
}
