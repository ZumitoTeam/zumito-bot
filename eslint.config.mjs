import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        "plugins": {
            "@typescript-eslint": typescriptEslint,
        },

        "languageOptions": {
            "parser": tsParser,
            "globals": {
                "node": true,
                process: true
            }
        },

        "files": [
            '**/*.js',
            '**/*.ts',
        ],

        "rules": {
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
            "camelcase": ["error", { "properties": "always" }],
            "prefer-template": "warn",
            "spaced-comment": ["error", "always", { "markers": ["/"] }]
        },
    },
];