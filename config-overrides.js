const {
  override,
  addBabelPreset,
  addPostcssPlugins,
} = require('customize-cra');


module.exports = override(
  addBabelPreset('@emotion/babel-preset-css-prop'),
  addPostcssPlugins([
    require('tailwindcss')('./src/tailwind.config.js')
  ])
)
