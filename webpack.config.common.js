const glob = require('glob');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const generateHTMLPlugins = () => glob.sync('./demo/**/*.html').map(
  dir => new HTMLWebpackPlugin({
    filename: path.basename(dir), // Output
    template: dir // Input
  })
);

module.exports = {
  node: {
    fs: 'empty'
  },
  entry: ['./demo/js/application.js', './demo/style/application.sass'],
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
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        test: /\.(pdf|gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static/'
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './demo/static/',
        to: './static/'
      }
    ]),
    ...generateHTMLPlugins()
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: -10,
          name: 'vendors'
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
};
