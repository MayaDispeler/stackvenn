import { defineConfig, devices } from '@playwright/test';

// Runs against the production build (npm run build first). Drafts are included via SHOW_DRAFTS=true.
export default defineConfig({
  testDir: 'tests',
  testIgnore: 'unit/**',
  outputDir: 'test-results',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://localhost:4322', ...devices['Desktop Chrome'] },
  webServer: {
    command: 'npx astro preview --port 4322',
    url: 'http://localhost:4322',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
