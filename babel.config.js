module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-typescript', { allowDeclareFields: true }],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-typescript',
      {
        allowDeclareFields: true,
      },
    ],
    '@babel/proposal-class-properties',
  ],
};
