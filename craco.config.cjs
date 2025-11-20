const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src/api'),
      });
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve?.fallback,
          stream: require.resolve('stream-browserify'),
          path: false,
					url: require.resolve('url')
        },
      };

      return webpackConfig;
    },
  },
  devServer: {
    proxy: {
      '/api': 'http://localhost:6540',
    },
  },
  babel: {
    presets: ['@babel/preset-typescript'],
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
