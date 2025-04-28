import js from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";

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
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "simple-import-sort/imports": "warn",
    },
  },
);
