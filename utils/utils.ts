import { CountryCode } from "../lib/CountryCode";
import { LanguageCode } from "../lib/LanguageCode";
import { Page, Locator } from "playwright";

export class Utils {
  constructor() {}

  static getCountryCode(countryName: string): CountryCode | undefined {
    return CountryCode[countryName];
  }

  static getLanguageCode(languageName: string): LanguageCode | undefined {
    return LanguageCode[languageName as keyof typeof LanguageCode];
  }

  static areArraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  static async populateArray(
    page: Page,
    nextButton: Locator,
    arrayElement: Locator,
    resultPerPageCount?: number,
    totalCount?: number
  ): Promise<string[]> {
    let arrayToBePopulated: string[] = [];
    let count = 1;

    totalCount = totalCount === undefined ? 1 : totalCount;
    resultPerPageCount =
      resultPerPageCount === undefined ? 1 : resultPerPageCount;

    const reminderExists = totalCount % resultPerPageCount;
    const maxScrolls =
      reminderExists == 0
        ? Math.floor(totalCount / resultPerPageCount)
        : Math.floor(totalCount / resultPerPageCount) + 1;

    console.log("total::" + totalCount);
    console.log("per page::" + resultPerPageCount);
    console.log("MAX SCROLLS::" + maxScrolls);

    // const maxScrolls = 8;

    // console.log("maxScrolls:::::" + totalElementCount + ' / ' + elementCountPerPage + ' = ' + maxScrolls);
    // await page.waitForLoadState("networkidle");

    console.log("before: " + arrayToBePopulated + "\n");
    while (count <= maxScrolls) {
      console.log(count);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      await arrayElement.first().waitFor({ state: "visible" });
      console.log("\n" + (await arrayElement.allInnerTexts()) + "\n");
      const arrayElementCount = await arrayElement.count();

      for (let index = 0; index < arrayElementCount; index++) {
        const dateText = await arrayElement.nth(index).innerText();
        arrayToBePopulated.push(dateText);
      }
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));

      // Check if nextButton is visible before clicking
      const isVisible = await nextButton.isVisible();
      if (!isVisible || count >= maxScrolls) {
        break;
      }
      await nextButton.click();

      for (const [index, date] of arrayToBePopulated.entries()) {
        console.log(`Index ${index}: ${date}`);
      }

      await page.waitForLoadState("networkidle");

      count++;
    }
    console.log("after: " + arrayToBePopulated);

    return arrayToBePopulated;
  }
}
