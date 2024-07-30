import { test as baseTest } from "@playwright/test";
import HomePage from "../pages/HomePage";
import RegionHomePage from "../pages/RegionHomePage";

// import exp from "constants";

const test = baseTest.extend<{
  homePage: HomePage;
  regionHomePage: RegionHomePage;
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  regionHomePage: async ({ page }, use) => {
    await use(new RegionHomePage(page));
  },
});

export default test;
