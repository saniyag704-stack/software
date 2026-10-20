import { test, expect } from '../fixtures.js';

// This spec performs four full navigations per test; give it room under
// parallel load so a slow Vite transform cannot fail the run.
test.describe.configure({ timeout: 60_000 });

/**
 * Discoverability checks — run against both implementations.
 *
 * The static site ships one <head> per page; the React app applies per-route
 * metadata with `usePageMeta()` and serves `robots.txt` + `sitemap.xml` from
 * `react-app/public/`, so the same assertions hold for both.
 */

/** Normalises a route so `/index.html`, `/skills.html` and `/skills` compare equal. */
function normalizeRoute(pathname) {
  return (
    pathname
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/'
  );
}

/**
 * The React app sets its metadata in a layout effect during the route commit.
 * Waiting for the page heading guarantees that commit has happened, so both
 * implementations can be read the same way.
 */
async function waitForPage(page) {
  await expect(page.locator('h1')).toHaveCount(1, { timeout: 15_000 });
  await expect(page.locator('h1')).toBeVisible({ timeout: 15_000 });
}

test.describe('Metadata', () => {
  test('every page has a unique title containing the brand', async ({ page, paths }) => {
    const titles = [];

    for (const path of Object.values(paths)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await waitForPage(page);

      const title = await page.title();
      expect(title, path).toContain('Skill GPS');
      titles.push(title);
    }

    expect(titles).toHaveLength(Object.keys(paths).length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  test('every page has a unique, descriptive meta description', async ({ page, paths }) => {
    const descriptions = [];

    for (const path of Object.values(paths)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await waitForPage(page);

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description, `${path} has no meta description`).toBeTruthy();
      expect(description.length, path).toBeGreaterThanOrEqual(80);
      expect(description.length, path).toBeLessThanOrEqual(200);
      descriptions.push(description);
    }

    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  test('every page ships complete Open Graph and Twitter cards', async ({ page, paths }) => {
    const ogTags = ['og:type', 'og:site_name', 'og:title', 'og:description'];
    const twitterTags = ['twitter:card', 'twitter:title', 'twitter:description'];

    for (const path of Object.values(paths)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await waitForPage(page);

      for (const tag of ogTags) {
        const value = await page.locator(`meta[property="${tag}"]`).getAttribute('content');
        expect(value, `${path} is missing ${tag}`).toBeTruthy();
      }

      for (const tag of twitterTags) {
        const value = await page.locator(`meta[name="${tag}"]`).getAttribute('content');
        expect(value, `${path} is missing ${tag}`).toBeTruthy();
      }

      // The social title must mirror the document title of the current route.
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', await page.title());
    }
  });

  test('every page declares a theme colour, an inline favicon and a responsive viewport', async ({ page, paths }) => {
    for (const path of Object.values(paths)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await waitForPage(page);

      await expect(page.locator('meta[name="theme-color"]'), path).toHaveCount(1);

      const icon = await page.locator('link[rel="icon"]').getAttribute('href');
      expect(icon, `${path} favicon`).toMatch(/^data:image\/svg\+xml/);

      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport, path).toContain('width=device-width');
    }
  });
});

test.describe('Crawling files', () => {
  test('robots.txt allows crawling and points at the sitemap', async ({ page }) => {
    const response = await page.request.get('/robots.txt');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/text\/plain/);

    const body = await response.text();
    expect(body).toContain('User-agent: *');
    expect(body).toMatch(/Allow:\s*\//);
    expect(body).toMatch(/Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/);
  });

  test('sitemap.xml lists every page that actually exists', async ({ page, paths }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const xml = await response.text();
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const priorities = [...xml.matchAll(/<priority>([\d.]+)<\/priority>/g)].map((match) => Number(match[1]));

    const routes = Object.values(paths);
    expect(locations).toHaveLength(routes.length);
    expect(priorities).toHaveLength(locations.length);

    for (const priority of priorities) {
      expect(priority).toBeGreaterThan(0);
      expect(priority).toBeLessThanOrEqual(1);
    }

    // Every entry is absolute and maps onto a real route of this implementation.
    const routeByKey = new Map(routes.map((route) => [normalizeRoute(route), route]));
    const listed = locations.map((location) => {
      expect(location).toMatch(/^https:\/\/[^/]+\//);
      return normalizeRoute(new URL(location).pathname);
    });

    expect([...listed].sort()).toEqual(routes.map(normalizeRoute).sort());

    for (const key of listed) {
      const localPath = routeByKey.get(key);
      expect(localPath, `${key} is listed in the sitemap but is not a known page`).toBeTruthy();

      const navigation = await page.goto(localPath, { waitUntil: 'domcontentloaded' });
      expect(navigation?.status() ?? 0, `${localPath} is listed in the sitemap`).toBe(200);
    }
  });

  test('no same-origin request fails on any page', async ({ page, paths }, testInfo) => {
    const base = testInfo.project.use.baseURL;
    const failures = [];

    page.on('response', (response) => {
      if (base && response.url().startsWith(base) && response.status() >= 400) {
        failures.push(`${response.status()} ${response.url()}`);
      }
    });

    for (const path of Object.values(paths)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await waitForPage(page);
    }

    expect(failures).toEqual([]);
  });
});
