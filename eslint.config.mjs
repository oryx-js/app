import { defineConfig } from "eslint/config";
import globals from "globals";
import pluginJs from '@eslint/js';
import js from "@eslint/js";
import tseslint from "typescript-eslint";


export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        ignores: ['node_modules/', 'dist/', 'logs/'],
    },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            'prefer-const': 'warn',
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },
]);
