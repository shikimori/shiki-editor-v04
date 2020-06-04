module.exports = {
  presets: [
    [
      '@babel/preset-env'
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-proposal-pipeline-operator',
      { proposal: 'minimal' }
    ],
    '@babel/plugin-proposal-partial-application',
    [
      '@babel/plugin-proposal-class-properties',
      { loose: true }
    ]
  ]
};
