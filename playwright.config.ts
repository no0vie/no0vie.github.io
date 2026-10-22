import { defineConfig } from '@playwright/test';
import { publishingConfig } from './scripts/publishing';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  workers: 2,
  use: {
    baseURL: `http://127.0.0.1:4173${publishingConfig().base}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: 'npx tsx scripts/server.ts',
    url: `http://127.0.0.1:4173${publishingConfig().base}`,
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
