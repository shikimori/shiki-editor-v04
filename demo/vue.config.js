// https://cli.vuejs.org/config/#css-modules
module.exports = {
  css: {
    // extract: true
    // loaderOptions: {
    //   sass: {
    //     data: '@import "@/stylesheets/globals.sass";'
    //   }
    // }
  },
  lintOnSave: process.env.NODE_ENV === 'development',
  devServer: {
    // overlay: {
    //   warnings: true,
    //   errors: true
    // }
  },
  // transpileDependencies: ['delay'],
  pluginOptions: {
  }
};
