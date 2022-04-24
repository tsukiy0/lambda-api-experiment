const withTM = require("next-transpile-modules")();

module.exports = withTM({
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
});
