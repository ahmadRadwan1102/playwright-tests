import { expect, Locator, Page } from "@playwright/test";
import { ProductPage } from "../pages/ProductPage";

export async function getProduct(productPage: ProductPage, porductNum: number): Promise<Locator> {
        const productSelector = '.product-items  li.product-item'
        const products = productPage.page.locator(productSelector);
        await productPage.page.waitForSelector(`${productSelector}:first-child div[class^=swatch-opt-]`)
        // await products.first().waitFor({ state: 'visible', timeout: 10000 });
        let product: Locator;
        if (await products.count() > porductNum) {
            product = products.nth(porductNum - 1);
        }
        else {
            console.log(`product not found: first product return`)
            product = products.nth(0);
        }
    
    //const product = page.locator('li.product-item').nth(0);
    await expect(product).toBeVisible();
    return product
}