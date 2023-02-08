module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          // crypto: require.resolve('crypto-browserify'),
          crypto: false,
          stream: require.resolve('stream-browserify'),
        },
      },
    },
  },
};
