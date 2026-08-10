export function fallbackDisplayName(displayName: string | undefined, handle: string): string {
  return displayName == null || displayName === "" ? handle : displayName;
}
