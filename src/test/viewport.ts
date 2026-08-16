export const Viewport = {
  mobile: [375, 667],
  tablet: [768, 1024],
  laptop: [1440, 900],
  desktop: [1920, 1080],
} as const satisfies Record<string, [number, number]>;
