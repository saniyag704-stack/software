import { test, expect, pageUrl } from '../fixtures.js';
import { DOMAIN_NAMES } from '../paths.js';

test.describe('Home page', () => {
  test('hero communicates the value proposition with two calls to action', async ({ page, home }) => {
    await home.goto();

    await expect(page).toHaveTitle(/Skill GPS/);
    await expect(home.heroHeading).toContainText('Find your direction');
    await expect(home.heroHeading).toContainText('Master the right skills');
    await expect(home.heroPrimaryCta).toBeVisible();
    await expect(home.heroSecondaryCta).toBeVisible();
  });

  test('the dashboard mockup shows four skill bars', async ({ home }) => {
    await home.goto();

    await expect(home.dashboardCard).toBeVisible();
    await expect(home.dashboardBars).toHaveCount(4);

    const labels = await home.dashboardCard.locator('.gps-skill .meta b').allInnerTexts();
    expect(labels).toEqual(['HTML & CSS', 'JavaScript', 'React', 'Backend & APIs']);
  });

  test('trust statistics resolve to real numbers', async ({ home }) => {
    await home.goto();

    await expect(home.stats).toHaveCount(4);
    const values = await home.statValues();

    values.forEach((value) => expect(value).toMatch(/\d/));
    expect(values[0]).toMatch(/12,?400\+/);
    expect(values[1]).toMatch(/^6$/);
    expect(values[2]).toMatch(/^24$/);
    expect(values[3]).toMatch(/^92%$/);
  });

  test('all six career tracks are listed with demand badges', async ({ page, home }) => {
    await home.goto();

    await expect(home.domainCards).toHaveCount(6);
    for (const name of Object.values(DOMAIN_NAMES)) {
      await expect(home.domainCard(name)).toBeVisible();
    }
    await expect(page.locator('.domain-card .demand')).toHaveCount(6);
  });

  test('the supporting sections are present', async ({ home }) => {
    await home.goto();

    await expect(home.featureCards).toHaveCount(3);
    await expect(home.steps).toHaveCount(4);
    await expect(home.testimonials).toHaveCount(3);
    await expect(home.ctaBand).toBeVisible();
  });

  test('clicking a track opens the assessment for that track', async ({ page, home, skills, paths }) => {
    await home.goto();
    await home.openTrack('Data Science');

    await expect(page).toHaveURL(pageUrl(paths.skills));
    expect(page.url()).toContain('domain=data');
    await expect(skills.activeTrack).toContainText('Data Science');
    await expect(skills.panelTitle).toContainText('Data Science');
  });

  test('the hero CTA starts the assessment', async ({ page, home, paths }) => {
    await home.goto();
    await home.heroPrimaryCta.click();

    await expect(page).toHaveURL(pageUrl(paths.skills));
    await expect(page.locator('#quizPanel')).toBeVisible();
  });
});
