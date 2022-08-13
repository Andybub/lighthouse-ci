module.exports = {
  ci: {
    collect: {
      /* Add configuration here */
      startServerCommand: 'shopify theme serve',
      url: ['https://lighthouse-ci-test.myshopify.com'],
      numberOfRuns: 1,
    },
    upload: {
      /* Add configuration here */
      target: 'temporary-public-storage',
    },
  },
};