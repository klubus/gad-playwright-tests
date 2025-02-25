import { BASE_URL } from '@_config/env.config';
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export const STORAGE_STATE = path.join(__dirname, 'tmp/session.json');

export default defineConfig({
  testDir: './tests',
  globalSetup: 'config/global.setup.ts',
  timeout: 20_000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  workers: undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    baseURL: BASE_URL,
  },

  projects: [
    {
      name: 'chromium-non-logged',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: /@logged/,
    },
    {
      name: 'setup',
      testMatch: '*.setup.ts',
    },
    {
      name: 'chromium-logged',
      grep: /@logged/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
    },
  ],
});
