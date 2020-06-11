module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { exclude: ['transform-regenerator'] }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-proposal-class-properties',
      { loose: true }
    ]
  ]
};
