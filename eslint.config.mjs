import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
            globals: {
                "node": true,
            }
        },

        rules: {
            "no-unused-vars": "error",
            "no-undef": "error",
            "indent": ["error", 4],

            "no-multiple-empty-lines": ["error", {
                max: 1,
            }],
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-expressions": "error",
            "prefer-const": "error",
            "brace-style": ["error", "1tbs"],
            "max-depth": ["warn", 4],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],
            "linebreak-style": ["error", "unix"],
            "camelcase": ["error", { "properties": "always" }],
            "prefer-template": "warn",
            "spaced-comment": ["error", "always", { "markers": ["/"] }]
        },
    },
];