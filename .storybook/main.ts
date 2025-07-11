import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  framework: '@storybook/react-webpack5',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  core: {
    builder: {
      name: '@storybook/builder-webpack5',
      options: {
        fsCache: true,
        lazyCompilation: true,
      },
    },
  },

  addons: [
    '@storybook/addon-webpack5-compiler-babel',
    '@storybook/addon-docs'
  ],
  staticDirs: ['../public'],

	 webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      path: require.resolve('path-browserify'),
    };

		config.module?.rules?.push(
    {
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require.resolve('sass'),
          },
        },
      ],
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }
  );

  	return config;
  },
};

export default config;
