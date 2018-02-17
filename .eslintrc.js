module.exports = {
  extends: ['eslint:recommended', 'xo-react', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  env: {
    node: true,
    es6: true,
    browser: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      classes: true
    }
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        bracketSpacing: false,
        printWidth: 100
      }
    ],
    // 'prettier/prettier': 'error',
    // 'unicorn/no-new-buffer': 'off',
    // 'unicorn/filename-case': 'off',
    // 'unicorn/custom-error-definition': 'off',
    // 'unicorn/no-array-instanceof': 'off',
    // 'unicorn/catch-error-name': 'off',
    // 'unicorn/no-process-exit': 'off',
    // 'unicorn/throw-new-error': 'off',
    // 'unicorn/number-literal-case': 'off',
    // 'unicorn/prefer-starts-ends-with': 'off',
    // 'unicorn/prefer-type-error': 'off',
    // 'unicorn/explicit-length-check': 'off',
    // 'unicorn/no-abusive-eslint-disable': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/forbid-component-props': 'off',
    'react/jsx-no-bind': 'warn',
    'react/no-array-index-key': 'warn',
    'react/no-string-refs': 'warn',
    'react/destructuring-assignment': 'off',
    'import/no-unresolved': 'off',
    'import/no-unassigned-import': 'off',
    'import/prefer-default-export': 'off',
    'unicorn/no-abusive-eslint-disable': 'off'
  }
}
