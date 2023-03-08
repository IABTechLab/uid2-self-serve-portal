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
};
