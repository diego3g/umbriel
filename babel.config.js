module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@modules': './src/modules',
          '@infra': './src/infra',
          '@core': './src/core',
          '@config': './src/config',
          '@test': './src/test',
        },
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
}
