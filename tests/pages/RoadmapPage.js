/** Roadmap page: track picker, phases, milestone checkboxes and progress. */
export class RoadmapPage {
  constructor(page, paths) {
    this.page = page;
    this.path = paths.roadmap;
  }

  async goto(domain) {
    await this.page.goto(domain ? `${this.path}?domain=${domain}` : this.path);
  }

  get trackSelect() {
    return this.page.locator('#trackSelect');
  }

  async selectTrack(value) {
    await this.trackSelect.selectOption(value);
  }

  get phases() {
    return this.page.locator('.phase');
  }

  phase(index) {
    return this.phases.nth(index);
  }

  get phaseTitles() {
    return this.page.locator('.phase-card .phase-top h3');
  }

  get donePhases() {
    return this.page.locator('.phase.done');
  }

  get fastTrackBadges() {
    return this.page.locator('.phase .badge-accent');
  }

  get progressValue() {
    return this.page.locator('.progress-card .big');
  }

  async progressPercent() {
    const text = await this.progressValue.innerText();
    return Number(text.replace(/[^\d]/g, ''));
  }

  get progressBar() {
    return this.page.locator('.progress-card .bar > span');
  }

  get phaseBadge() {
    return this.page.locator('.progress-card .panel-head .badge');
  }

  get itemsDone() {
    return this.page.locator('.progress-card .row span').first();
  }

  get resetButton() {
    return this.page.getByRole('button', { name: /reset this roadmap/i });
  }

  get levelPill() {
    return this.page.locator('.level-pill').first();
  }

  get assessmentCta() {
    return this.page.getByRole('link', { name: /take the assessment/i });
  }

  get retakeLink() {
    return this.page.getByRole('link', { name: /retake assessment/i });
  }

  get trackMetaBadges() {
    return this.page.locator('#trackMeta .badge, .roadmap-side .panel .row .badge');
  }

  /** The checkbox for phase `phaseIndex`, item `itemIndex` (visually hidden). */
  checkbox(phaseIndex, itemIndex) {
    return this.phase(phaseIndex).locator('input[type="checkbox"]').nth(itemIndex);
  }

  /** Clicks the label, because the input itself is visually hidden. */
  async toggleItem(phaseIndex, itemIndex) {
    await this.phase(phaseIndex).locator('.check-item').nth(itemIndex).click();
  }

  async checkItem(phaseIndex, itemIndex) {
    if (!(await this.checkbox(phaseIndex, itemIndex).isChecked())) {
      await this.toggleItem(phaseIndex, itemIndex);
    }
  }

  async completePhase(phaseIndex) {
    const count = await this.phase(phaseIndex).locator('.check-item').count();
    for (let i = 0; i < count; i++) {
      await this.checkItem(phaseIndex, i);
    }
  }

  async reset({ confirm = true } = {}) {
    this.page.once('dialog', (dialog) => (confirm ? dialog.accept() : dialog.dismiss()));
    await this.resetButton.click();
  }

  async storedProgress() {
    return this.page.evaluate(() => {
      const raw = localStorage.getItem('skillgps.progress.v1');
      return raw ? JSON.parse(raw) : null;
    });
  }
}
