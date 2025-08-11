module.exports = {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript'
    ],
    env: {
      development: {
        plugins: ['istanbul']
      },
      test: {
        plugins: ['istanbul']
      }
    }
  };
  