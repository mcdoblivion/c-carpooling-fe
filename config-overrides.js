const reactAppRewirePostcss = require("react-app-rewire-postcss");
const postcssColorMod = require("postcss-color-mod-function");

module.exports = function override(config) {
  reactAppRewirePostcss(config, {
    plugins: () => [postcssColorMod(/* pluginOptions */)],
  });
  return config;
};
