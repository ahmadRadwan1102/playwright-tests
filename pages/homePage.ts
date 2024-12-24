import { expect, Locator, Page } from "@playwright/test";
import { Base } from "./Base";

export class HomePage extends Base {
    readonly customerWelcome: Locator
    constructor(page: Page) {
        super(page);
        this.customerWelcome = this.page.locator(`header span:text('Welcome, ')`)
    }

    async isAuthenticated(condtion: (lcator: Locator) => Promise<void>) {
        await condtion(this.customerWelcome)
    }

    async hasProducts() {
        const products = this.page.locator(`li.product-item`);
        const productsConut = await products.count();
        expect(productsConut).toBeGreaterThan(0); // can see the products without auth...
        await expect(products.nth(0)).toBeVisible();
        // for (let i = 0; i < productsConut; i++) {
        //     // check the visbality of each product in home page
        //     const product = products.nth(i);
        //     await expect(product).toBeVisible(); 
        // }
    }

    

}