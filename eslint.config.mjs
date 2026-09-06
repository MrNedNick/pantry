import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import next from 'eslint-config-next'

export default tseslint.config(
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'coverage/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
)
