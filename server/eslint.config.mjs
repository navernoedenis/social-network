import eslintPrettierConfig from 'eslint-config-prettier';
import eslintPrettierRules from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import json from 'eslint-plugin-json';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['**/*.test.ts'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ...json.configs.recommended,
    files: ['**/*.json'],
    rules: {
      'json/*': ['error', 'allowComments'],
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  eslintPrettierRules,
  eslintPrettierConfig,
];
