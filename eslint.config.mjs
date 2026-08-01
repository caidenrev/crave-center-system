import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Matikan error merah untuk penggunaan tipe data 'any'
      "@typescript-eslint/no-explicit-any": "off",

      // (Opsional) Mengubah alert variabel yang tidak terpakai dari merah menjadi kuning (warn)
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]);

export default eslintConfig;