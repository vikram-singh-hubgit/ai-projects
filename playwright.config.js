const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [['html', { open: 'never' }]],
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:5000/health',
    env: {
      DB_DIALECT: 'sqlite',
      DB_STORAGE: './database/test.sqlite',
      DB_NAME: 'test',
      JWT_SECRET: 'test_secret',
      PORT: '5000'
    },
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000
  }
});
