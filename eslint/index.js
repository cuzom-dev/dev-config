// Cuzom's base ESLint flat config for TypeScript and JavaScript projects:
// recommended rules, TypeScript without heavy typing, and Prettier owns the formatting.
//
//   // eslint.config.js
//   import cuzom from '@cuzom/eslint-config'
//   export default [...cuzom, { /* project rules */ }]
//
// Nuxt apps use Nuxt's own config instead, with Prettier last:
//   withNuxt(prettierConfig) — see README.md.
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** Build output and tool folders no project wants linted. */
export const ignores = {
  ignores: [
    '**/dist/**',
    '**/dist-lib/**',
    '**/build/**',
    '**/coverage/**',
    '**/.turbo/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/.vercel/**',
    '**/playwright-report/**',
    '**/test-results/**',
  ],
}

/** Light typing: let inference work, keep the linter useful for refactoring. */
export const lightTypes = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
    ],
    '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-expect-error': 'allow-with-description', 'ts-ignore': true, 'ts-nocheck': true },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: "Use a union of string literals instead of an enum: type Mode = 'a' | 'b'.",
      },
    ],
  },
}

export default [
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
  },
  lightTypes,
  prettierConfig,
]
