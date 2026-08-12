import { expect, test } from "vitest";

import { formatCompactCount } from "./format-compact-count";

test("formats compact counts to three significant digits", () => {
  expect(formatCompactCount(123)).toBe("123");
  expect(formatCompactCount(1234)).toBe("1.23 k");
  expect(formatCompactCount(12345)).toBe("12.3 k");
  expect(formatCompactCount(123456)).toBe("123 k");
  expect(formatCompactCount(1234567)).toBe("1.23 m");
});
