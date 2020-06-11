const path = require('path');

module.exports = {
  node: {
    fs: 'empty'
  },
  entry: ['./demo/js/application.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
