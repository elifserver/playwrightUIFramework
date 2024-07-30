import { chromium, Browser, BrowserContext, Page, test, expect } from '@playwright/test';

test("101 title", async () => {
  // Launch the browser
  // const browser: Browser = await chromium.launch({ headless: false }); // Set headless to true if you don't want to see the browser

  // Create a new incognito browser context
  // const context: BrowserContext = await browser.newContext();

  const context: BrowserContext = await chromium.launchPersistentContext('', {headless: false})

  // Open a new page in the incognito context
  const page: Page = await context.newPage();

  // Navigate to a website
  await page.goto('https://www.wtwco.com/en-us/solutions/insurance-consulting-and-technology');

  // // Perform any actions you need
  // console.log('Page title:', await page.title());

  var region = "Americas";
  var country = "United States";
  var lang = "English";
  // const alertdialog = page.locator('button[id="onetrust-accept-btn-handler"]');
  const alertdialogCookieSettings = page.getByRole("button", {
    name: "Cookie Settings",
  });
  await alertdialogCookieSettings.click();

  const confirmChoicesButton = page.getByRole("button", {
    name: "Confirm My Choices",
  });
  await confirmChoicesButton.click();

  await expect(page.getByRole("link", { name: "Why WTW" })).toBeVisible();

  const locationSelector = page.getByLabel("Expand/collapse to choose");

  await locationSelector.click();

  await page.getByRole("button", { name: `${region}` }).click();

  await page
    .getByLabel(`Willis Towers Watson ${country} website in ${lang}`)
    .click();

  await expect(page).toHaveTitle(
    "WTW: Perspective that moves you | Risk, Broking, HR, Benefits - WTW"
  );

  const blockerElement = page.locator(
    "#homepage-hero__bg-image-1 img.wtw-motif"
  );
  await blockerElement.waitFor({ state: "visible" });

  page.getByRole("button", { name: "Search" }).click();

  const searchComboBox = page.getByRole("combobox", { name: "Search box" });
  await searchComboBox.fill("IFRS");
  await searchComboBox.press("Enter");

  // Close the page and browser context
  await page.close();
  await context.close();

  // Close the browser
  // await browser.close();
});