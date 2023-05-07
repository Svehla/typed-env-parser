module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    semi: 'off',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'prettier/prettier': [
      'error',
      {
        semi: false,
        useTabs: false,
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 100,
        tabWidth: 2,
        arrowParens: 'avoid',
        jsxSingleQuote: true,
      },
    ],
  },
}
