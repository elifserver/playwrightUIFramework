// import { expect, chromium } from "@playwright/test";
import test from "../lib/BaseTest";
import { KeyObject } from "crypto";
import { text } from "stream/consumers";
import { Page, Locator } from "playwright";
import { CountryCode } from "../lib/CountryCode";
import { LanguageCode } from "../lib/LanguageCode";
import { expect } from "@playwright/test";
import { Utils } from "../utils/utils";
import { SearchFilters } from "../lib/searchFilters"; 

test.beforeEach(
  "go till search page",
  async ({ homePage, regionHomePage, page }) => {
    await homePage.navigateToUrl();

    let region = "Americas";
    let country = "United States";
    let lang = "English";

    await homePage.confirmMyCookieSettingChoices();
    await homePage.chooseRegionCountryLang(region, country, lang);
    await regionHomePage.assertLandingOnThePage(country, lang);
    await regionHomePage.clickSearchButton();
  }
);

test("check if the results are sorted by date", async ({ page, regionHomePage }) => {
  await regionHomePage.searchFor("IFRS");
  await regionHomePage.areResultsSortedByDate();
  
});

test("filter the results by Article and check the URL", async ({
  page,
  regionHomePage,
}) => {
  await regionHomePage.searchFor("IFRS");
  await regionHomePage.filterTheResultsBy(SearchFilters.Article);
  await regionHomePage.checkIfTheLinksStartWith("https://www.wtwco.com/en-us/");
});
