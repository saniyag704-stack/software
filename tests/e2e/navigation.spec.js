import { test, expect, pageUrl } from '../fixtures.js';

test.describe('Navigation and site chrome', () => {
  test('the four primary pages are linked in the header', async ({ home, nav }) => {
    await home.goto();

    await expect(nav.links).toHaveCount(4);
    await expect(nav.links).toHaveText(['Home', 'Skills', 'Roadmap', 'Contact']);
    await expect(nav.ctaButton).toBeVisible();
  });

  test('each nav link navigates and is marked active', async ({ page, home, nav, paths }) => {
    await home.goto();

    const targets = [
      { label: 'Skills', path: paths.skills, heading: /know exactly where you stand/i },
      { label: 'Roadmap', path: paths.roadmap, heading: /from where you are to hired/i },
      { label: 'Contact', path: paths.contact, heading: /find your direction|let’s find your direction/i },
      { label: 'Home', path: paths.home, heading: /find your direction/i }
    ];

    for (const target of targets) {
      await nav.link(target.label).click();
      await expect(page).toHaveURL(pageUrl(target.path));
      await expect(nav.activeLink).toHaveText(target.label);
      await expect(page.locator('h1')).toContainText(target.heading);
    }
  });

  test('theme toggle flips the theme and persists across reloads', async ({ page, home, nav }) => {
    await home.goto();

    const initial = await nav.theme();
    expect(['dark', 'light']).toContain(initial);

    await nav.toggleTheme();
    const flipped = await nav.theme();
    expect(flipped).not.toBe(initial);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', flipped);

    await nav.toggleTheme();
    await expect(page.locator('html')).toHaveAttribute('data-theme', initial);
  });

  test('the sticky header gains a scrolled state', async ({ page, home, nav }) => {
    await home.goto();
    await expect(nav.header).not.toHaveClass(/scrolled/);

    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(nav.header).toHaveClass(/scrolled/);
  });

  test('footer shows the current year and platform links', async ({ page, home }) => {
    await home.goto();

    const year = new Date().getFullYear();
    await expect(page.locator('.footer-bottom')).toContainText(String(year));
    await expect(page.locator('.footer-links a')).not.toHaveCount(0);
    await expect(page.locator('.socials a')).toHaveCount(3);
  });
});

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger menu opens, navigates and closes', async ({ page, home, nav, paths }) => {
    await home.goto();

    await expect(nav.mobileToggle).toBeVisible();
    await expect(nav.links.first()).toBeHidden();

    await nav.openMobileMenu();
    await expect(nav.mobileToggle).toHaveAttribute('aria-expanded', 'true');
    expect(await nav.isMobileMenuOpen()).toBe(true);
    await expect(nav.mobileMenu.getByRole('link', { name: 'Skills', exact: true })).toBeVisible();

    await nav.mobileLink('Skills').click();
    await expect(page).toHaveURL(pageUrl(paths.skills));
    await expect(nav.mobileToggle).toHaveAttribute('aria-expanded', 'false');
    expect(await nav.isMobileMenuOpen()).toBe(false);
  });

  test('tapping outside closes the mobile menu', async ({ page, home, nav }) => {
    await home.goto();

    await nav.openMobileMenu();
    expect(await nav.isMobileMenuOpen()).toBe(true);

    await page.mouse.click(200, 700);
    expect(await nav.isMobileMenuOpen()).toBe(false);
  });
});
