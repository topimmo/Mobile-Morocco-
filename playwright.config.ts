import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for production smoke tests.
 * These tests run against the production build to ensure deployment readiness.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  
  // Fail the build if any test fails
  expect: {
    timeout: 10000,
  },
  
  // Global timeout for each test
  timeout: 30000,

  use: {
    // Base URL points to local preview server
    baseURL: 'http://localhost:4173',
    
    // Capture trace on first retry for debugging
    trace: 'on-first-retry',
    
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    
    // Collect console errors
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start the preview server before running tests
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
