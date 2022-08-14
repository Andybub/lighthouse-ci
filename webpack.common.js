const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  stats: 'minimal',
  context: path.resolve('src'),
  entry: {
    main: 'main.js',
    index: 'index.js',
    collection: 'collection.js',
    'search-result': 'search-result.js',
    product: 'product.js',
    quickview: 'quickview.js',
    blogs: 'blogs.js',
    article: 'article.js',
    'list-collections': 'list-collections.js',
    'weekly-promotion': 'weekly-promotion.js',
    'shop-the-look': 'shop-the-look.js',
    'track-your-order': 'track-your-order.js',
    'contact-us': 'contact-us.js',
    login: 'login.js',
    account: 'account.js',
    404: '404.js',
    cart: 'cart.js',
    checkout: 'checkout.js',
    'refer-a-friend': 'refer-a-friend.js',
    'why-buy-from-us': 'why-buy-from-us.js',
    'reviews-promo': 'reviews-promo.js',
    'swym-wishlist': 'swym-wishlist.js'
  },
  output: {
    path: path.resolve('shopify/assets/'),
    filename: 'tw-[name].js',
    chunkFilename: 'tw-[name].js?v=[chunkhash]',
    library: {
      name: ['TW', '[name]'],
      type: 'window',
    },
  },
  resolve: {
    extensions: ['.js', '.scss'],
    modules: [path.resolve('src'), path.resolve('node_modules')],
    alias: {
      '@': path.resolve('src'),
      '@shopify': path.resolve('shopify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              hoistUseStatements: true,
              resources: [path.resolve('src/scss/_mixins.scss'), path.resolve('src/scss/_variables.scss')],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    /**
     * don't clean files with the 'static' keyword in their filename
     * docs: https://github.com/johnagan/clean-webpack-plugin
     */
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['tw-*', '!tw-tracking-3rd-party.js'],
    }),
    /**
     * docs: https://webpack.js.org/plugins/mini-css-extract-plugin
     */
    new MiniCssExtractPlugin({
      filename: 'tw-[name].css',
      chunkFilename: 'tw-[name].css?v=[chunkhash]',
    }),
  ],
};
