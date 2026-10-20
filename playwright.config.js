import { defineConfig, devices } from '@playwright/test';

/**
 * Skill GPS — Playwright configuration
 *
 * Two browser projects run the SAME specs against both implementations:
 *   • static — plain HTML/CSS/JS site served from the project root
 *   • react  — the Vite + React Router app in ./react-app
 *
 * A third `unit` project runs fast data-integrity checks in Node.
 */

const STATIC_URL = 'http://127.0.0.1:8777';
const REACT_URL = 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },

  // Evidence per test case:
  //   • list   — one line per test (status + duration) on the console
  //   • html   — playwright-report/index.html, per-test detail + screenshots
  //   • junit  — evidence/junit.xml, one <testcase> element per test
  // Screenshots are captured for EVERY test (not just failures) so each case
  // has its own visual record under test-results/<test>/.
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'evidence/junit.xml' }]
  ],

  use: {
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    // Reveal animations and counters resolve instantly, keeping assertions deterministic.
    reducedMotion: 'reduce',
    actionTimeout: 10_000
  },

  webServer: [
    {
      command: 'npm run serve:static',
      url: `${STATIC_URL}/index.html`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000
    },
    {
      command: 'npm run serve:react',
      url: REACT_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    }
  ],

  projects: [
    {
      name: 'static',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: STATIC_URL }
    },
    {
      name: 'react',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: REACT_URL }
    },
    {
      name: 'unit',
      testDir: './tests/unit'
    }
  ]
});
