import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: {
    timeout: 8000
  },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:5173/net-ve-tri-an-dntu-2026/',
    viewport: { width: 1920, height: 1080 }
  },
  webServer: {
    command: 'npx vite --port 5173 --host 127.0.0.1',
    url: 'http://127.0.0.1:5173/net-ve-tri-an-dntu-2026/',
    reuseExistingServer: !process.env.CI,
    timeout: 20000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
