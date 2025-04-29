import js from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importAccess from "eslint-plugin-import-access/flat-config";
import checkFile from "eslint-plugin-check-file";

export default tseslint.config(
  gitignore(),
  {
    ignores: ["dist", "worker-configuration.d.ts"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      sonarjs.configs.recommended,
      security.configs.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      "import-access": importAccess,
      "check-file": checkFile,
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "no-undefined": "error",
      "no-eval": "error",
      curly: "error",
      camelcase: "error",
      "func-style": [
        "error",
        "expression",
        {
          overrides: {
            namedExports: "declaration",
          },
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/prefer-enum-initializers": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "simple-import-sort/imports": "warn",
      "import-access/jsdoc": [
        "error",
        /** @see https://github.com/uhyo/eslint-plugin-import-access/blob/master/docs/rule-jsdoc.md */
        {
          defaultImportability: "package",
        },
      ],
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "**/*": "KEBAB_CASE",
        },
      ],
    },
  },
);
