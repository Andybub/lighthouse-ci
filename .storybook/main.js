const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },

  previewHead: (head) => {
    const assetsURL = 'https://cdn.shopify.com/s/files/1/1552/7691/t/1474/assets/';
    return `${head}
      <link href="${assetsURL}bootstrap.min.css" rel="stylesheet" type="text/css" media="all"></link>
      <link href="${assetsURL}style-speed.css" rel="stylesheet" type="text/css" media="all"></link>
      <link href="${assetsURL}style.min.css" rel="stylesheet" type="text/css" media="all"></link>
      <link href="${assetsURL}theme.min.css" rel="stylesheet" type="text/css" media="all"></link>

      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <style>
        body {
          --f_family: 'Inter', sans-serif;
        }
      </style>

      <link href="${assetsURL}md_prd_card_grid.min.css" rel="stylesheet" type="text/css" media="all"></link>
      <link href="${assetsURL}kiti-var.css" rel="stylesheet" type="text/css" media="all"></link>

      <link href="${assetsURL}icomoon.css" rel="stylesheet"></link>
    `;
  },
};
