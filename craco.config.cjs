module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
          path: false,
        },
      },
    },
  },
  devServer: {
    proxy: {
      '/api': 'http://localhost:6540',
    },
  },
  babel: {
    present: ['@babel/preset-typescript', { allowDeclareFields: true }],
    plugins: [
      [
        '@babel/plugin-transform-typescript',
        {
          allowDeclareFields: true,
        },
      ],
    ],
  },
};
