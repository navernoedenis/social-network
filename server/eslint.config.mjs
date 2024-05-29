import eslintPrettierConfig from 'eslint-config-prettier';
import eslintPrettierRules from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  eslintPrettierRules,
  eslintPrettierConfig,
];
