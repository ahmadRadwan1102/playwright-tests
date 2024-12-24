import {test, expect, Locator} from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/LoginPage';
require('dotenv').config();


const URL = 'https://magento.softwaretestingboard.com';
const EMAIL = process.env.EMAIL!;
const PASSWORD = process.env.PASSWORD!;

let homePage: HomePage;
let loginPage: LoginPage;
test.describe('General Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(URL, {waitUntil: 'domcontentloaded'})
        await expect(page).toHaveURL(URL)
        homePage = new HomePage(page);
    })
    
    test('Verify That, the user is able to navigate to homepage and view products without authentication', async () => {
        await homePage.VerifyPage('Home') // verify user was navigate to homePage.
        await homePage.isAuthenticated(async (locator: Locator) => await expect(locator).not.toBeVisible()); // ensure user without authentication.
        
        await homePage.hasProducts();
    })
    
    test('Verify that, the user can login successfuly and redirect to home page with shown welcome msg', async ({page}) => {
        loginPage = new LoginPage(page);

        await homePage.page.locator(`header a[href*='login']`).click();
        await loginPage.VerifyPage('Login');
        await loginPage.signIn(EMAIL, PASSWORD);

        await homePage.isAuthenticated(async (locator: Locator) => await expect(locator).toBeVisible()); // ensure user authentication.
        await loginPage.page.close();

    })

    test('Verify that, the User can search on a specific product', async ({ page }) => {
        const searchTerm = 'Tank'
        await homePage.searchTo(searchTerm);
        await homePage.VerifyPage(searchTerm)
        await homePage.hasProducts();
    })

    test('Verify all search result should contain the search term - (search for “backpack”)', async () => {
        const searchTerm = 'backpack'
        await homePage.searchTo(searchTerm);
        await homePage.page.waitForLoadState('networkidle') // wait for request loded

        const products = await homePage.page.locator(`.results a.product-item-link`).allInnerTexts();
        
        await homePage.AllContainSearchTerm(products, searchTerm); // verify is the result product have the serach term >> 
    })

    test.afterEach(async () => {
        // Clean up after the test 
        await homePage.page.close();
    });

});

