import { Nav } from './Nav.js';

export class HomePage {
  constructor(page, paths) {
    this.page = page;
    this.path = paths.home;
    this.nav = new Nav(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }

  get heroHeading() {
    return this.page.locator('.hero h1');
  }

  get heroPrimaryCta() {
    return this.page.locator('.hero-cta').getByRole('link', { name: /take the free skill test/i });
  }

  get heroSecondaryCta() {
    return this.page.locator('.hero-cta').getByRole('link', { name: /explore roadmaps/i });
  }

  get dashboardCard() {
    return this.page.locator('.gps-card');
  }

  get dashboardBars() {
    return this.page.locator('.gps-skill .bar > span');
  }

  get stats() {
    return this.page.locator('.hero-trust .item');
  }

  statValues() {
    return this.page.locator('.hero-trust .item strong').allInnerTexts();
  }

  get featureCards() {
    return this.page.locator('#why .card');
  }

  get domainCards() {
    return this.page.locator('.domain-card');
  }

  domainCard(name) {
    return this.page.locator('.domain-card', { hasText: name });
  }

  get steps() {
    return this.page.locator('.step');
  }

  get testimonials() {
    return this.page.locator('.quote-card');
  }

  get ctaBand() {
    return this.page.locator('.cta-band');
  }

  async openTrack(name) {
    await this.domainCard(name).click();
  }
}
