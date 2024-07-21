module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'semi': ['warn'],
    'quotes': ['warn', 'single'],
    'import/order': ['warn', {
      'alphabetize': { order: 'asc' },
      'newlines-between': 'always',
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ]
    }],
    "@typescript-eslint/consistent-type-imports": "warn",
  },
  settings: {
    'import/resolver': {
      "typescript": true
    },
  }
}
