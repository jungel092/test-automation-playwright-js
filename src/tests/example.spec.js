import { test } from "@playwright/test";

test("should open login page", async ({ page }) => {
    await page.goto("https://team8-2022brno.herokuapp.com/prihlaseni");
    console.log(await page.title());
});

test("should open registration page and take screenshot", async ({ page }) => {
    await page.goto("https://team8-2022brno.herokuapp.com/registrace");

    await page.screenshot({ path: "registration_page.png" });
});