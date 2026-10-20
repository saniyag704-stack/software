import { test, expect, pageUrl } from '../fixtures.js';

test.describe('Career roadmap', () => {
  test('shows five phases with realistic detail', async ({ roadmap }) => {
    await roadmap.goto();

    await expect(roadmap.phases).toHaveCount(5);
    await expect(roadmap.phaseTitles).toHaveText([
      'The web, decoded',
      'JavaScript, properly',
      'React & component thinking',
      'Full-stack capability',
      'Portfolio & interviews'
    ]);
    await expect(roadmap.phase(0).locator('.check-item')).toHaveCount(4);
    await expect(roadmap.phase(0).locator('.duration')).not.toBeEmpty();
  });

  test('a ?domain= deep link selects that roadmap', async ({ page, roadmap }) => {
    await roadmap.goto('cloud');

    await expect(roadmap.trackSelect).toHaveValue('cloud');
    await expect(roadmap.phaseTitles.first()).toContainText('Linux & the network');
    expect(page.url()).toContain('domain=cloud');
  });

  test('without an assessment it invites you to personalise', async ({ roadmap }) => {
    await roadmap.goto();

    await expect(roadmap.assessmentCta).toBeVisible();
    await expect(roadmap.levelPill).toHaveCount(0);
    await expect(roadmap.fastTrackBadges).toHaveCount(0);
  });

  test('progress starts empty', async ({ roadmap }) => {
    await roadmap.goto();

    expect(await roadmap.progressPercent()).toBe(0);
    await expect(roadmap.phaseBadge).toContainText('0 / 5 phases');
    await expect(roadmap.donePhases).toHaveCount(0);
    await expect(roadmap.progressValue).toBeVisible();
  });

  test('checking a milestone updates the counter and stores progress', async ({ roadmap }) => {
    await roadmap.goto();

    await roadmap.toggleItem(0, 0);
    expect(await roadmap.progressPercent()).toBe(5); // 1 of 20 items
    await expect(roadmap.itemsDone).toContainText('1 item done');

    const stored = await roadmap.storedProgress();
    expect(stored.web['0-0']).toBe(true);

    await roadmap.toggleItem(0, 0);
    expect(await roadmap.progressPercent()).toBe(0);
    expect((await roadmap.storedProgress()).web).toEqual({});
  });

  test('completing a phase marks it done and celebrates', async ({ page, roadmap }) => {
    await roadmap.goto();

    await roadmap.completePhase(0);

    await expect(roadmap.donePhases).toHaveCount(1);
    await expect(roadmap.phaseBadge).toContainText('1 / 5 phases');
    expect(await roadmap.progressPercent()).toBe(20);
    await expect(page.locator('.toast-wrap .toast').last()).toContainText(/phase complete/i);
  });

  test('progress survives a reload', async ({ page, roadmap }) => {
    await roadmap.goto();
    await roadmap.checkItem(1, 0);
    await roadmap.checkItem(1, 1);

    await page.reload();

    await expect(roadmap.checkbox(1, 0)).toBeChecked();
    await expect(roadmap.checkbox(1, 1)).toBeChecked();
    expect(await roadmap.progressPercent()).toBe(10);
  });

  test('reset clears the roadmap after confirmation', async ({ roadmap }) => {
    await roadmap.goto();
    await roadmap.completePhase(0);
    expect(await roadmap.progressPercent()).toBeGreaterThan(0);

    await roadmap.reset({ confirm: true });

    expect(await roadmap.progressPercent()).toBe(0);
    await expect(roadmap.checkbox(0, 0)).not.toBeChecked();

    const stored = await roadmap.storedProgress();
    expect(stored).toEqual({});
  });

  test('dismissing the reset dialog keeps progress', async ({ page, roadmap }) => {
    await roadmap.goto();
    await roadmap.checkItem(0, 0);

    await roadmap.reset({ confirm: false });

    await expect(page.locator('.phase').first()).toBeVisible();
    expect(await roadmap.progressPercent()).toBe(5);
    await expect(roadmap.checkbox(0, 0)).toBeChecked();
  });

  test('progress is tracked per track', async ({ roadmap }) => {
    await roadmap.goto();
    await roadmap.checkItem(0, 0);
    expect(await roadmap.progressPercent()).toBe(5);

    await roadmap.selectTrack('data');
    await expect(roadmap.phaseTitles.first()).toContainText('Python & spreadsheets');
    expect(await roadmap.progressPercent()).toBe(0);

    await roadmap.selectTrack('web');
    expect(await roadmap.progressPercent()).toBe(5);
  });
});

test.describe('Roadmap personalisation', () => {
  test('an advanced result unlocks fast-track phases', async ({ seedAssessment, roadmap }) => {
    await seedAssessment('web', 100, 2);
    await roadmap.goto();

    await expect(roadmap.levelPill).toContainText('Advanced');
    await expect(roadmap.retakeLink).toBeVisible();
    await expect(roadmap.assessmentCta).toHaveCount(0);
    await expect(roadmap.fastTrackBadges).toHaveCount(4);
    await expect(roadmap.phase(0).locator('.phase-card')).toContainText(/likely know the basics/i);
  });

  test('a beginner result shows no fast-track phases', async ({ seedAssessment, roadmap }) => {
    await seedAssessment('design', 25, 0);
    await roadmap.goto('design');

    await expect(roadmap.levelPill).toContainText('Beginner');
    await expect(roadmap.fastTrackBadges).toHaveCount(0);
  });

  test('an assessment for another track does not personalise this one', async ({ seedAssessment, roadmap }) => {
    await seedAssessment('web', 100, 2);
    await roadmap.goto('marketing');

    await expect(roadmap.levelPill).toHaveCount(0);
    await expect(roadmap.fastTrackBadges).toHaveCount(0);
    await expect(roadmap.assessmentCta).toBeVisible();
  });
});

test.describe('Roadmap navigation', () => {
  test('the assessment link points at the same track', async ({ roadmap, paths, page }) => {
    await roadmap.goto();

    await expect(roadmap.assessmentCta).toHaveAttribute('href', /domain=web/);
    await roadmap.assessmentCta.click();
    await expect(page).toHaveURL(pageUrl(paths.skills));
  });
});
