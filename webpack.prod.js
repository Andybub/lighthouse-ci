const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin'); // included in webpack 5, no need to add to package.json
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          enforce: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      /**
       * docs: https://webpack.js.org/plugins/terser-webpack-plugin
       */
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
        // `terserOptions` options will be passed to `uglify-js`
        // Link to options - https://github.com/mishoo/UglifyJS#minify-options
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: 'some',
          },
        },
        extractComments: false,
      }),
      /**
       * docs: https://webpack.js.org/plugins/css-minimizer-webpack-plugin
       */
      new CssMinimizerPlugin(),
    ],
  },
});
