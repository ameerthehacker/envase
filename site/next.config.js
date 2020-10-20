const withImages = require('next-images');

module.exports = withImages({
  webpack(config) {
    return config;
  }
});
