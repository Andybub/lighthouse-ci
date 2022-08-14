const path = require('path');

module.exports = async ({ config, mode }) => {
  console.log(`storybook config mode --> ${mode}`);

  config.resolve.alias = {
    '@': path.resolve(__dirname, '../src/'),
  };

  config.module.rules.push({
    test: /\.scss$/i,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader',
      'sass-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          hoistUseStatements: true,
          resources: [
            path.resolve(__dirname, '../src/scss/_mixins.scss'),
            path.resolve(__dirname, '../src/scss/_variables.scss'),
          ],
        },
      },
    ],
    include: path.resolve(__dirname, '../src'),
  });

  return config;
};
