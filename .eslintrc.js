module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.common.js',
      },
    },
  },
  globals: {
    Shopify: 'readonly',
    $: 'readonly',
  },
  extends: ['airbnb', 'prettier', 'plugin:import/recommended', 'plugin:storybook/recommended'],
  plugins: ['prettier', 'import', 'react', 'react-hooks', 'jest'],
  rules: {
    'prettier/prettier': 2,
    /**
     * add custom rules
     * docs: https://eslint.org/docs/rules
     */
    'no-console': 0,
    'no-plusplus': 0,
    'import/prefer-default-export': 0,
    'arrow-body-style': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
      },
    ],
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': 0,
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-props-no-spreading': 0,
    'react/forbid-prop-types': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
  },
};
