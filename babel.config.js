module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3.6.5'
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-proposal-pipeline-operator',
      { proposal: 'minimal' }
    ],
    '@babel/plugin-proposal-partial-application'
  ]
};
