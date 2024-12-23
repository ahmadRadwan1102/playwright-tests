import { test, expect} from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { ProductPage } from '../pages/ProductPage';
import { getProduct } from '../utils/getProduct';
import { addProductToCart } from '../utils/addProductToCart';

const URL = 'https://magento.softwaretestingboard.com';

let homePage: HomePage;
let productPage: ProductPage;

test.describe('Product Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(URL, { waitUntil: 'domcontentloaded' });
        //await page.goto(URL);
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
    });

    test('Verify product page navigation and product name matches', async ({ page }) => {
        const product = await getProduct(productPage, 1)
        const productName = await product.locator(`.product-item-details > strong a`).innerText();

        await product.click()
        // Verify product name consistency
        const productNameHeading = page.locator('h1.page-title > span');
        await productPage.checkNameConsistency(productNameHeading, productName);
    });

    test(`User can add a product to Cart`, async ({ page }) => {
        const counterSelector = page.locator('header .counter-number');
        const initCounter: number = Number(await counterSelector.textContent());

        await addProductToCart(productPage);

        await productPage.isDropDownVisible();
        // assert the new Counter = initCounter + 1 when added one product >> so the product added
        const count = await page.locator(`span.count`).innerText();
        expect(count).toBe(String(initCounter + 1));
    });

    test('Verify that the product is added to the cart “checkout/cart/” — assert for product name', async ({ page }) => {
        const productName = await addProductToCart(productPage);

        await productPage.isDropDownVisible();

        await page.locator('a.viewcart').click();
        await expect(page).toHaveURL(/.*\/checkout\/cart\//);

        const checkoutProduct = page.locator('form#form-validate strong a');
        await productPage.checkNameConsistency(checkoutProduct, productName);
    });

    test('Can empty the cart - assert for “You have no items in your shopping cart.” Message', async ({ page }) => {
        await addProductToCart(productPage);

        await productPage.isDropDownVisible();
        // Remove the item
        const removeItemButton = page.locator('a[title="Remove item"]');
        await expect(removeItemButton).toBeVisible();
        await removeItemButton.click();

        // Confirm the removal
        const confirmButton = page.locator('button.action-accept');
        await expect(confirmButton).toBeVisible();
        await confirmButton.click();
            
        const emptyCartMessage = page.locator('strong.empty');
        await expect(emptyCartMessage).toBeVisible();
    });
    
    test.afterEach(async ({ page }) => {
        await page.close();
        await homePage.page.close();
        await productPage.page.close();
    });
});
