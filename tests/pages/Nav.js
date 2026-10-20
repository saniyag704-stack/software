/** Navigation bar, mobile menu and theme switch. */
export class Nav {
  constructor(page) {
    this.page = page;
  }

  get header() {
    return this.page.locator('header.nav');
  }

  get links() {
    return this.page.locator('.nav-links a');
  }

  get activeLink() {
    return this.page.locator('.nav-links a.active');
  }

  get mobileToggle() {
    return this.page.locator('.nav-toggle');
  }

  get mobileMenu() {
    return this.page.locator('.mobile-menu');
  }

  get themeButton() {
    return this.page.getByRole('button', { name: /switch to (light|dark) mode/i });
  }

  get ctaButton() {
    return this.header.getByRole('link', { name: /start assessment/i });
  }

  link(name) {
    return this.header.getByRole('link', { name, exact: true });
  }

  mobileLink(name) {
    return this.mobileMenu.getByRole('link', { name, exact: true });
  }

  async theme() {
    return this.page.locator('html').getAttribute('data-theme');
  }

  async toggleTheme() {
    await this.themeButton.click();
  }

  async openMobileMenu() {
    await this.mobileToggle.click();
  }

  async closeMobileMenu() {
    if (await this.mobileMenu.evaluate((el) => el.classList.contains('open'))) {
      await this.mobileToggle.click();
    }
  }

  async isMobileMenuOpen() {
    return this.mobileMenu.evaluate((el) => el.classList.contains('open'));
  }
}
