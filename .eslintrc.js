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
  rules: {}
}
