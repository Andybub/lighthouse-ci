const path = require('path');

module.exports = {
  verbose: true,
  moduleNameMapper: {
    '@/(.*)': path.resolve('src/$1'),
  },
};
