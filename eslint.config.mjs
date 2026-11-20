import astro from "eslint-plugin-astro";
import typescriptParser from "@typescript-eslint/parser";

export default [
  { ignores: [".astro/**", "dist/**", "playwright-report/**", "test-results/**", "public/**"] },
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: { parserOptions: { parser: typescriptParser } },
  },
  {
    files: ["**/*.ts"],
    languageOptions: { parser: typescriptParser },
    rules: {
      "eqeqeq": "error",
      "no-debugger": "error",
      "no-var": "error",
      "prefer-const": "error",
    },
  },
];
