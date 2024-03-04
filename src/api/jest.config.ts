import type { Config } from 'jest';

const config: Config = {
  rootDir: '../../',
  setupFiles: ['dotenv/config', './src/api/jest.setup.ts', './src/api/jest.polyfills.ts'],
  testMatch: ['**/api/**/*.test.ts', '**/api/**/*.spec.ts'],
};

export default config;
