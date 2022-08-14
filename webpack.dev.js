const path = require('path');
const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    /**
     * docs: https://www.npmjs.com/package/eslint-webpack-plugin
     */
    new ESLintPlugin({
      files: 'src/{**/*,*}.{js}',
      overrideConfigFile: path.resolve('.eslintrc.js'),
    }),
    /**
     * docs: https://www.npmjs.com/package/stylelint-webpack-plugin
     */
    new StylelintPlugin({
      files: 'src/{**/*,*}.{scss}',
      configFile: path.resolve('.stylelintrc.js'),
    }),
  ],
  optimization: {
    splitChunks: false,
  },
});
