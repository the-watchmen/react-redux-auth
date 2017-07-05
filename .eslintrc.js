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
  rules: {
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
    'react/forbid-component-props': 'warn',
    'react/jsx-no-bind': 'warn',
    'react/no-array-index-key': 'warn',
    'react/no-string-refs': 'warn',
    'import/no-unresolved': 'off',
    'import/no-unassigned-import': 'off',
    'import/prefer-default-export': 'off'
  }
}
