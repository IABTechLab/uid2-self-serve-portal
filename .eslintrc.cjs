module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
    'react-app',
    'react-app/jest',
    'airbnb-typescript',
    'prettier',
    'plugin:react/jsx-runtime',
    'plugin:storybook/recommended',
  ],
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.local.json'],
  },
  plugins: [
    'promise',
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'testing-library',
    'react',
  ],
  env: {
    node: true,
    jest: true,
  },
  globals: {
    __DEV__: 'readonly',
    __TEST__: 'readonly',
    __PROD__: 'readonly',
    $: 'writable',
  },
  rules: {
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['Switch.Root'],
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'no-var': ['error'],
    'no-mixed-spaces-and-tabs': ['error'],
    'brace-style': ['error'],
    'spaced-comment': 'warn',
    'no-trailing-spaces': 'warn',
    'key-spacing': 'error',
    'max-len': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'object-curly-spacing': ['error', 'always'],
    'eol-last': 'error',
    'unicode-bom': 'error',
    'react/react-in-jsx-scope': 'off',
    'padded-blocks': ['warn', 'never'],
    'jsx-a11y/control-has-associated-label': 'off',
    'no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^(_|(args|props|event|e)$)',
        varsIgnorePattern: '^_',
      },
    ],
    'no-multiple-empty-lines': 'warn',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['components/examples/*', 'components/display/Glyph', 'enzyme'],
      },
    ],
    'no-restricted-globals': ['error', 'location'],
    'no-throw-literal': 'error',
    camelcase: [
      'error',
      {
        allow: ['data-testid'],
      },
    ],
    eqeqeq: ['error', 'smart'],
    'arrow-body-style': 'off',
    'function-call-argument-newline': 'off',
    'lines-between-class-members': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: true,
        allowUnboundThis: false,
      },
    ],
    'sort-imports': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^@?\\w'],
          ['^components/'],
          ['^models/'],
          ['^util/'],
          ['^\\.'],
          ['^\\u0000.*\\.s?css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
		'import/extensions': [
  		'error',
  		'ignorePackages',
  		{
				ts: 'always',
				tsx: 'never',
				js: 'never',
				jsx: 'never',
  		},
],
    'testing-library/consistent-data-testid': [
      'error',
      {
        testIdPattern: '([a-z][a-z\\-]*)+[a-z]',
        testIdAttribute: ['data-testid'],
      },
    ],
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow',
      },
    ],
  },
  overrides: [
    {
      files: ['*.spec.*', '*.test.*'],
      rules: {
        '@typescript-eslint/no-floating-promises': ['error'],
      },
    },
    {
      files: ['*.stories.*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/function-component-definition': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['*.tsx', '*.ts'],
      rules: {
        'consistent-return': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/require-default-props': 'off',
        'react/destructuring-assignment': 'off',
        'no-unused-vars': 'off',
        'class-methods-use-this': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'after-used',
            ignoreRestSiblings: true,
            argsIgnorePattern: '^(_|(args|props|event|e)$)',
            varsIgnorePattern: '^_',
          },
        ],
        semi: 'off',
        '@typescript-eslint/semi': ['error'],
        'react/self-closing-comp': 'warn',
      },
    },
    {
      files: ['*.js'],
      rules: {
        'no-unused-vars': [
          'error',
          {
            args: 'after-used',
            ignoreRestSiblings: true,
            argsIgnorePattern: '^(_|(args|props|event|e)$)',
            varsIgnorePattern: '^_',
          },
        ],
      },
    },
  ],
};
