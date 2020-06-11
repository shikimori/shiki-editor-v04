module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', { useBuiltIns: 'usage' }]
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
