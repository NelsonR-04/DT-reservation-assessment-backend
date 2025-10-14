module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'prettier',
    'unused-imports',
    'simple-import-sort',
    'regexp',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:regexp/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules', 'coverage'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf',
      },
    ],
    'linebreak-style': 0,
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1,
        maxBOF: 0,
      },
    ],
    'arrow-body-style': ['error', 'as-needed'],
    'no-trailing-spaces': 'error',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'regexp/no-super-linear-backtracking': 'error',
    'regexp/no-useless-escape': 'error',
    'regexp/strict': 'error',
    'regexp/no-lazy-ends': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          [
            '^\\u0000',
            '^@?\\w',
            '^@/',
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
          ],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-shadow': ['error'],
    'no-console': 'off',
    'no-inline-comments': 'error',
    'no-shadow': 'off',
    'no-undef': 'off',
    'no-prototype-builtins': 'off',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
  },
  overrides: [
    {
      // JavaScript files don't need TypeScript parser
      files: ['**/*.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'script',
      },
      extends: ['eslint:recommended', 'plugin:prettier/recommended'],
      rules: {
        'prettier/prettier': 'error',
      },
    },
    {
      // ES module JavaScript files
      files: ['**/*.mjs'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      extends: ['eslint:recommended', 'plugin:prettier/recommended'],
      rules: {
        'prettier/prettier': 'error',
      },
    },
  ],
};