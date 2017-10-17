module.exports = {
  extends: ['eslint:recommended', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  env: {
    es6: true,
    browser: true
  },
  ecmaFeatures: {
    modules: true,
    jsx: true
  },
  globals: {
    __DEV__: true
  },
  plugins: ['prettier'],
  rules: {
    'unicorn/no-abusive-eslint-disable': 'off',
    'react/prop-types': 'off',
    'react/forbid-component-props': 'off',
    'react/jsx-no-bind': 'warn',
    'react/no-array-index-key': 'warn',
    'react/no-string-refs': 'warn',
    'react/require-default-props': 'off',
    'import/no-unassigned-import': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        bracketSpacing: false,
        printWidth: 100
      }
    ]
  }
}
