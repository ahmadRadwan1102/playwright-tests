import { expect, Locator, Page } from "@playwright/test";
import { Base } from "./Base";

export class ProductPage extends Base {
    constructor(page:Page) {
        super(page);
    }

    async checkNameConsistency(productLocater: Locator, checkMatch: string) {
        await expect(productLocater).toHaveText(checkMatch);
    }

    async addProduct(product:Locator) {
        await this.page.waitForTimeout(1500);
        await this.selectFirstOptionIfExeist(Attribute.size, product);
        await this.selectFirstOptionIfExeist(Attribute.color, product);

        const addToCartBtn = product.locator(`button[title="Add to Cart"]`);
        await expect(addToCartBtn).toBeVisible();
        const responsePromise = this.page.waitForResponse('https://magento.softwaretestingboard.com/');
        await addToCartBtn.click();
        const response = await responsePromise;


    }

    async isDropDownVisible() {
        await this.page.waitForTimeout(2000);


        const cart = this.page.locator('a.showcart');
        await cart.waitFor({ state: 'visible', timeout: 2000 }); 
        await cart.click();

        await expect(this.page.locator('div[data-role="dropdownDialog"]')).toBeVisible();
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