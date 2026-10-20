import { test as base, expect } from '@playwright/test';
import { pathsFor, assessmentPayload, STORAGE } from './paths.js';
import { Nav } from './pages/Nav.js';
import { HomePage } from './pages/HomePage.js';
import { SkillsPage } from './pages/SkillsPage.js';
import { RoadmapPage } from './pages/RoadmapPage.js';
import { ContactPage } from './pages/ContactPage.js';

/**
 * Shared fixtures.
 *
 * The same specs run against the static site and the React app; the `paths`
 * fixture adapts URLs, and the page objects hide every other difference.
 */

export const test = base.extend({
  paths: [
    async ({}, use, testInfo) => {
      await use(pathsFor(testInfo.project.name));
    },
    { scope: 'test' }
  ],

  nav: async ({ page }, use) => {
    await use(new Nav(page));
  },

  home: async ({ page, paths }, use) => {
    await use(new HomePage(page, paths));
  },

  skills: async ({ page, paths }, use) => {
    await use(new SkillsPage(page, paths));
  },

  roadmap: async ({ page, paths }, use) => {
    await use(new RoadmapPage(page, paths));
  },

  contact: async ({ page, paths }, use) => {
    await use(new ContactPage(page, paths));
  },

  /** Collects console errors and uncaught exceptions for every test. */
  consoleErrors: [
    async ({ page }, use) => {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
      await use(errors);
    },
    { auto: true }
  ],

  /** Seeds a finished assessment into localStorage before assertions run. */
  seedAssessment: async ({ page }, use) => {
    await use(async (domain = 'web', score = 100, level) => {
      const payload = assessmentPayload(domain, score, level);
      await page.goto('/');
      await page.evaluate(
        ([key, value]) => localStorage.setItem(key, JSON.stringify(value)),
        [STORAGE.assessment, payload]
      );
      return payload;
    });
  },

  /** Seeds roadmap progress (e.g. { web: { '0-0': true } }). */
  seedProgress: async ({ page }, use) => {
    await use(async (progress) => {
      await page.goto('/');
      await page.evaluate(
        ([key, value]) => localStorage.setItem(key, JSON.stringify(value)),
        [STORAGE.progress, progress]
      );
    });
  },

  /** Wipes Skill GPS storage. Call before goto() to start from a clean slate. */
  clearStorage: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/');
      await page.evaluate(() => {
        ['skillgps.assessment.v1', 'skillgps.progress.v1'].forEach((k) => localStorage.removeItem(k));
      });
    });
  }
});

export { expect };

/** Beginner / Intermediate / Advanced thresholds used by the app. */
export function levelFor(score) {
  if (score >= 70) return 'Advanced';
  if (score >= 40) return 'Intermediate';
  return 'Beginner';
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Matches a route with or without a query string. */
export function pageUrl(path) {
  return new RegExp(`${escapeRegExp(path)}(\\?.*)?$`);
}
