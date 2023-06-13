import type { Config } from 'jest';

const config: Config = {
  rootDir: '../../',
  setupFiles: ['dotenv/config', './src/api/jest.setup.ts'],
  testMatch: ['**/api/tests/*.test.ts', '**/api/tests/*.spec.ts'],
};

export default config;
