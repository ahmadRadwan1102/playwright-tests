import { expect, Locator, Page } from "@playwright/test";
import { Base } from "./Base";

export class ProductPage extends Base {
    readonly cart: Locator;
    readonly dropdownDialog: Locator 
    constructor(page:Page) {
        super(page);
        this.cart = this.page.locator('a.showcart');
        this.dropdownDialog = this.page.locator('div[data-role="dropdownDialog"]');
    }

    async checkNameConsistency(productLocater: Locator, checkMatch: string) {
        await expect(productLocater).toHaveText(checkMatch);
    }

    async addProduct(product:Locator) {
        await this.selectFirstOptionIfExeist(Attribute.size, product);
        await this.selectFirstOptionIfExeist(Attribute.color, product);
        await product.hover();
        const addToCartBtn = product.locator(`button[title="Add to Cart"]`);
        const responsePromise = this.page.waitForResponse(res => 
            res.url().includes('https://magento.softwaretestingboard.com/') &&
            res.status() === 200
        );
        await addToCartBtn.click();
        const response = await responsePromise;
        console.log(`Response received: ${response.status()}`);


    }

    async isDropDownVisible() {

        await this.page.waitForSelector('.showcart span.counter'); 
        await this.cart.click();

        await this.dropdownDialog.waitFor({ state: 'visible', timeout: 5000 }); 

        await expect(this.dropdownDialog).toBeVisible();
    }

    private async selectFirstOptionIfExeist(attribute: Attribute, product: Locator) {
        const attributeSelector = product.locator(`div[attribute-code="${attribute}"]`)
        console.log(`Checking for attribute: ${attribute} with selector: ${attributeSelector}`);

        const attributeExists = await attributeSelector.count() > 0;
        console.log(`${attribute} exists: ${attributeExists}`);

        if(attributeExists) {
            const firstOption = attributeSelector.locator(`div.swatch-option:first-child`);
            await firstOption.click();
            await expect(firstOption).toHaveClass(/\bselected\b/)
        }
    }
} 

enum Attribute {
    size = 'size',
    color = 'color'
}