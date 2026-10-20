import { test, expect } from '../fixtures.js';

test.describe('Accessibility and markup hygiene', () => {
  test('every page loads without console errors', async ({ page, paths, consoleErrors }) => {
    for (const path of Object.values(paths)) {
      await page.goto(path);
      await expect(page.locator('h1').first()).toBeVisible();
    }
    expect(consoleErrors).toEqual([]);
  });

  test('each page declares a language and a single top-level heading', async ({ page, paths, consoleErrors }) => {
    for (const path of Object.values(paths)) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('h1')).toHaveCount(1);
    }
    expect(consoleErrors).toEqual([]);
  });

  test('every page exposes a title and a meta description', async ({ page, paths }) => {
    for (const path of Object.values(paths)) {
      await page.goto(path);
      await expect(page).toHaveTitle(/Skill GPS/);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0).toBeGreaterThan(40);
    }
  });

  test('contact form fields are labelled', async ({ page, contact, consoleErrors }) => {
    await contact.goto();

    const unlabelled = await page.evaluate(() => {
      const missing = [];
      document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select').forEach((el) => {
        const hasLabel = el.id && document.querySelector(`label[for="${el.id}"]`);
        const hasAria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
        if (!hasLabel && !hasAria) missing.push(el.id || el.name || el.tagName);
      });
      return missing;
    });

    expect(unlabelled).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('interactive controls carry accessible names and states', async ({ page, home, skills, nav }) => {
    await home.goto();

    await expect(nav.themeButton).toBeVisible();
    await expect(nav.themeButton).toHaveAccessibleName(/switch to (light|dark) mode/i);
    await expect(nav.mobileToggle).toHaveAttribute('aria-expanded', /true|false/);

    await skills.goto();
    await expect(skills.tracks.first()).toHaveAttribute('role', 'tab');
    await expect(skills.activeTrack).toHaveAttribute('aria-selected', 'true');

    const others = page.locator('.domain-btn[aria-selected="false"]');
    await expect(others).toHaveCount(5);
  });

  test('the quiz can be driven with the keyboard only', async ({ skills }) => {
    await skills.goto();
    const total = await skills.questionTotal();

    for (let i = 0; i < total; i++) {
      await skills.answerByKeyboard('b');
      if (i === total - 1) await skills.finishByKeyboard();
      else await skills.advanceByKeyboard();
    }

    await expect(skills.resultView).toBeVisible();
  });

  test('focus outlines are available for keyboard users', async ({ page, home }) => {
    await home.goto();

    // Under parallel load the first Tab can land outside the document, so keep
    // tabbing until a real element holds focus and check that it is visible.
    await expect(async () => {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return { tag: el.tagName, outline: style.outlineStyle, width: style.outlineWidth };
      });

      if (!focus) throw new Error('no element received focus');
      if (focus.outline === 'none' && focus.width === '0px') {
        throw new Error(`${focus.tag} has no visible focus ring`);
      }
    }).toPass({ timeout: 5_000 });
  });
});

test.describe('Supported viewports', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('desktop shows the full navigation and a two-column roadmap', async ({ page, home, nav, roadmap }) => {
    await home.goto();
    await expect(nav.links.first()).toBeVisible();
    await expect(nav.mobileToggle).toBeHidden();

    await roadmap.goto();
    const columns = await page.locator('.roadmap-shell').evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(columns.split(' ').length).toBe(2);
  });
});

test.describe('Small screens', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('no page scrolls sideways on a phone', async ({ page, paths, consoleErrors }) => {
    const offenders = {};

    for (const [name, path] of Object.entries(paths)) {
      await page.goto(path);
      const result = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      offenders[name] = result.scrollWidth - result.clientWidth;
    }

    expect(offenders).toEqual({ home: 0, skills: 0, roadmap: 0, contact: 0 });
    expect(consoleErrors).toEqual([]);
  });

  test('content stacks into a single column', async ({ page, home }) => {
    await home.goto();

    const columns = await page.locator('#tracks .grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(columns.split(' ').length).toBe(1);
    await expect(home.domainCards).toHaveCount(6);
  });

  test('floating hero chips are hidden so nothing overflows', async ({ page, home }) => {
    await home.goto();
    await expect(page.locator('.float-chip').first()).toBeHidden();
  });

  test('the roadmap stacks its sidebar above the timeline', async ({ page, roadmap }) => {
    await roadmap.goto();

    const columns = await page.locator('.roadmap-shell').evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(columns.split(' ').length).toBe(1);
    await expect(roadmap.phases).toHaveCount(5);
  });
});
