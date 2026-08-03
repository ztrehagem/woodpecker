import security from "eslint-plugin-security";
import { configs as sonarjs } from "eslint-plugin-sonarjs";
import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: [
    "oxc",
    "typescript",
    "react",
    "react-perf",
    "unicorn",
    "import",
    "jsx-a11y",
    "promise",
    "vitest",
  ],
  jsPlugins: ["eslint-plugin-sonarjs", "eslint-plugin-security"],
  options: {
    typeAware: true,
  },
  rules: {
    // "no-console": "warn",
    "no-debugger": "error",
    "no-undefined": "error",
    "no-eval": "error",
    curly: "error",
    "func-style": [
      "error",
      "declaration",
      {
        allowArrowFunctions: true,
        overrides: {
          namedExports: "declaration",
        },
      },
    ],
    "typescript/no-non-null-assertion": "off",
    "typescript/consistent-type-imports": "error",
    "typescript/explicit-module-boundary-types": "error",
    "typescript/prefer-enum-initializers": "error",
    "typescript/strict-boolean-expressions": "error",
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { allowConstantExport: true }],
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
      },
    ],
    ...sonarjs.recommended.rules,
    ...security.configs.recommended.rules,
  },
});
