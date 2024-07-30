import { Page, Locator } from "playwright";
import { expect } from "@playwright/test";
import { Utils } from "../utils/utils";

class RegionHomePage {
  readonly page: Page;
  readonly blockerElement: Locator;
  readonly searchComboBox: Locator;
  readonly resultsColumn: Locator;
  readonly nextButton: Locator;
  readonly dates: Locator;
  readonly footerNotesOfTheArticles: Locator;
  readonly totalResultCount: Locator;
  readonly resultsPerPageCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.blockerElement = page.locator(
      "#homepage-hero__bg-image-1 img.wtw-motif"
    );
    this.searchComboBox = page.getByRole("combobox", { name: "Search box" });
    this.resultsColumn = page.locator(".coveo-results-column");
    this.nextButton = page.getByLabel("pagination").getByLabel("next");
    this.dates = page.locator(".wtw-listing-result-date");
    this.footerNotesOfTheArticles = page.locator(".wtw-listing-result-uri");
    this.totalResultCount = page
      .locator("span.CoveoQuerySummary >> span.coveo-highlight")
      .nth(2);
    this.resultsPerPageCount = page
      .locator("span.CoveoQuerySummary >> span.coveo-highlight")
      .nth(1);
  }

  async assertLandingOnThePage(country: string, language: string) {
    const countryCode = Utils.getCountryCode(country);
    const languageCode = Utils.getLanguageCode(language);

    const currentUrl = this.page.url();
    let expectedSegment: string;

    // Expected URL segment
    if (countryCode && languageCode) {
      expectedSegment = `${languageCode}-${countryCode}`;
      // Check if the URL ends with the expected segment
      expect(currentUrl.endsWith(expectedSegment.toLowerCase())).toBe(true);
    } else {
      console.error("Invalid country or language code");
    }
  }

  async waitForPageFullyLoaded() {
    await this.blockerElement.waitFor({ state: "visible" });
  }

  async clickSearchButton() {
    await this.page.getByRole("button", { name: "Search" }).click();
  }

  async searchFor(searchWord: string) {
    await this.searchComboBox.fill(searchWord);
    await this.searchComboBox.press("Enter");
    await expect(this.resultsColumn).toBeVisible();
  }

  async filterTheResultsBy(filter: string) {
    const articleFilter = this.page.getByRole("button", { name: "${filter}" });
  }

  async areResultsSortedByDate() {
    let count = 0;

    let datesArray: string[] = await Utils.populateArray(
      this.page,
      this.nextButton,
      this.dates,
      parseInt(await this.resultsPerPageCount.innerText(), 10),
      parseInt(await this.totalResultCount.innerText(), 10)
    );

    const sortedArray = [...datesArray].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    console.log("SORTED ARAY: " + sortedArray);
    console.log("normal array: " + datesArray);
    // expect(arraysAreEqual(datesArray, sortedArray)).toBeTruthy();
    if (!Utils.areArraysEqual(datesArray, sortedArray)) {
      throw new Error(
        `The dates array is not sorted correctly. \n expected: ${datesArray} \n actual: ${sortedArray}`
      );
    }
  }
  
  async checkIfTheLinksStartWith(startingUrl: string) {

    let urlList: string[] = await Utils.populateArray(
      this.page,
      this.nextButton,
      this.footerNotesOfTheArticles
    );

    urlList.forEach((element) => {
      // expect(element.startsWith(startingUrl)).toBe(true, `URL ${element} does not start with ${startingUrl}`)
      if (element.indexOf(startingUrl) == -1) {
        throw new Error(`URL ${element} does not start with ${startingUrl}`);
      }
    });
  }
}

export default RegionHomePage;
