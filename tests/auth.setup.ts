import { test as setup, expect, Locator } from '@playwright/test';
import path from 'path';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/LoginPage';
require('dotenv').config();

const authFile = path.join(__dirname, '../playwright/.auth/user.json');
const URL = 'https://magento.softwaretestingboard.com';

const EMAIL = process.env.EMAIL!;
const PASSWORD = process.env.PASSWORD!;
setup('authenticate', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    // Perform authentication steps
    await page.goto(URL)
    await homePage.page.locator(`header a[href*='login']`).click();
    await loginPage.VerifyPage('Login');
    await loginPage.signIn(EMAIL, PASSWORD);
    await loginPage.page.waitForTimeout(500);
    await homePage.isAuthenticated(async (locator: Locator) => await expect(locator).toBeVisible()); // ensure user authentication.
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    // Alternatively, you can wait until the page reaches a state where all cookies are set.

    // End of authentication steps.

    await page.context().storageState({ path: authFile });
});