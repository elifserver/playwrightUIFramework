import { Locator, Page } from "playwright";
import { expect } from "@playwright/test";
import RegionHomePage from "../pages/RegionHomePage";

class HomePage {
  readonly page: Page;
  readonly alertdialogCookieSettings: Locator;
  readonly confirmChoicesButton: Locator;
  readonly locationSelector: Locator;
  readonly blockerElement: Locator;

  constructor(page: Page) {
    this.page = page;

    this.alertdialogCookieSettings = page.getByRole("button", {
      name: "Cookie Settings",
    });

    this.confirmChoicesButton = page.getByRole("button", {
      name: "Confirm My Choices",
    });

    this.locationSelector = page.getByLabel("Expand/collapse to choose");

    this.blockerElement = page.locator(
      "#homepage-hero__bg-image-1 img.wtw-motif"
    );
  }

  async navigateToUrl(): Promise<void> {
    await this.page.goto("/");
  }

  async confirmMyCookieSettingChoices(): Promise<void> {
    await this.alertdialogCookieSettings.click();
    await this.confirmChoicesButton.click();
  }

  // async waitForPageToBeLoaded() {
  //   await expect(
  //     this.page.getByRole("link", { name: "Why WTW" })
  //   ).toBeVisible();
  // }

  async chooseRegionCountryLang(region: string, country: string, lang: string) {
    const locationSelector = this.page.getByLabel("Expand/collapse to choose");
    await locationSelector.click();
    await this.page.getByRole("button", { name: `${region}` }).click();
    await this.page
      .getByLabel(`Willis Towers Watson ${country} website in ${lang}`)
      .click();
  }

  // async acceptCookies() {
  //   await this.page.locator('button[id="onetrust-accept-btn-handler"]').click();
  // }

  // async rejectCookies() {
  //   await this.page.locator('button[id="onetrust-reject-btn-handler"]').click();
  // }
}

export default HomePage;
