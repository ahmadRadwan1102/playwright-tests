import { expect, Locator, Page } from "@playwright/test";
import { HomePage } from "../pages/homePage";
import { LoginPage } from "../pages/LoginPage";
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

export async function authenticate(page: Page, email: string, pass: string) {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    //await page.goto(URL);
    await homePage.page.locator(`header a[href*='login']`).click();
    await loginPage.VerifyPage('Login');
    await loginPage.signIn(email, pass);
    await loginPage.page.waitForTimeout(500);
    await homePage.isAuthenticated(async (locator: Locator) => await expect(locator).toBeVisible());
    await page.context().storageState({ path: authFile });
}