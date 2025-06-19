import type { Config } from 'jest';

const config: Config = {
  rootDir: '../../',
  setupFiles: ['dotenv/config', './src/api/jest.setup.ts', './src/api/jest.polyfills.ts'],
  testMatch: ['**/api/**/*.test.ts', '**/api/**/*.spec.ts'],
	preset: 'ts-jest/presets/default-esm',
	globals: {
    'ts-jest': {
      useESM: true,
    },
  },
	transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts'],
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testEnvironment: 'node',
};

export default config;
