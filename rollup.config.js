import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import buble from '@rollup/plugin-buble';
import babel from '@rollup/plugin-babel';
import vue from 'rollup-plugin-vue';

module.exports = {
  input: './src/index.js',
  output: [{
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true
  }, {
    file: 'dist/index.es.js',
    format: 'es',
    sourcemap: true
  }],
  plugins: [
    vue(),
    css(),
    babel({ babelHelpers: 'bundled' }),
    resolve(),
    buble()
  ],
  external(id) { return !/^[\.\/]/.test(id); } // eslint-disable-line
};
