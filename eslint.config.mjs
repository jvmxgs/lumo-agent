import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig([
  // Base JS
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // Next.js
  ...nextVitals,
  ...nextTs,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      /*
       * TypeScript
       */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-var-requires': 'error',

      /*
       * Core best practices
       */
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': 'error',

      /*
       * Style
       */
      semi: ['error', 'never'],
      quotes: ['error', 'single'],

      /*
       * Console control
       */
      'no-console': isProduction
        ? ['error', { allow: ['warn', 'error', 'info'] }]
        : ['warn', { allow: ['warn', 'error', 'info', 'log'] }]
    }
  },

  // Prettier must go LAST
  prettier,

  // Ignore build artifacts
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ])
])
