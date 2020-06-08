const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');

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
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: -10,
          name: 'vendors'
        },
        prosemirror: {
          test: /[\\/]node_modules\/prosemirror/,
          chunks: 'initial',
          priority: -5,
          name: 'prosemirror'
        },
        vendors_async: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          chunks: 'async',
          priority: 0,
          name(module, chunks, _cacheGroupKey) {
            const moduleFileName = module.identifier().split('/').reduceRight(item => item);
            const allChunksNames = chunks.map(item => item.name).join('~');
            // return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
            // return allChunksNames || `${cacheGroupKey}-${moduleFileName}`;
            return allChunksNames || moduleFileName;
          }
        },
        venros_styles: {
          name: 'vendors',
          test: /\.s?(?:c|a)ss$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
          priority: 1
        }
      }
    },
    runtimeChunk: false,
    namedModules: true,
    namedChunks: true
  }
});
