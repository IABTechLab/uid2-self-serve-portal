module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
        },
      },
    },
  },
  devServer: {
    proxy: {
      '/api': 'http://localhost:6540',
    },
  },
};
