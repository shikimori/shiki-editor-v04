const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.config.common.js');
const chunks = require('./webpack.config.chunks.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: ['src', 'demo'],
    watchContentBase: true,
    hot: true,
    open: false,
    port: process.env.PORT || 9009,
    host: process.env.HOST || 'localhost'
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  optimization: {
    ...chunks
  }
});
