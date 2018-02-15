module.exports = {
  extends: ['eslint:recommended', 'xo-react', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['prettier', 'react'],
  rules: {
    'import/prefer-default-export': 'off',
    'react/forbid-component-props': 'off',
    'react/require-default-props': 'off',
    'react/destructuring-assignment': 'off',
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
