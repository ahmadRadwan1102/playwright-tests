import { Page } from "@playwright/test";
import { Base } from "./Base";
import { Shipping } from "../utils/ShipingType";

export class CheckoutPage extends Base {
    constructor(page: Page) {
        super(page);
    }

    async fillShippingAddress(shipping: Shipping) {
        const shippingSelector = 'li#shipping';
        const emailSelector = `${shippingSelector} input[name='username']`
        const email = this.page.locator(emailSelector);
        if (await this.page.isVisible(emailSelector) && (await email.inputValue()).length === 0) await email.fill(shipping.email);

        await this.page.locator(`${shippingSelector} input[name='firstname']`).fill(shipping.fName);
        await this.page.locator(`${shippingSelector} input[name='lastname']`).fill(shipping.lName);
        await this.page.locator(`${shippingSelector} input[name='company']`).fill(shipping.Company ?? '');
        await this.page.locator(`${shippingSelector} input[name='street[0]']`).fill(shipping.Street1);
        await this.page.locator(`${shippingSelector} input[name='street[1]']`).fill(shipping.Street2 ?? '');
        await this.page.locator(`${shippingSelector} input[name='street[2]']`).fill(shipping.Street3 ?? '');
        await this.page.locator(`${shippingSelector} input[name='city']`).fill(shipping.city);
        await this.page.locator(`${shippingSelector} select[name='country_id']`).selectOption({ value: shipping.Country });
        await this.page.locator(`${shippingSelector} input[name='region']`).fill(shipping.State);
        await this.page.locator(`${shippingSelector} input[name='postcode']`).fill(shipping.zipCode);
        await this.page.locator(`${shippingSelector} input[name='telephone']`).fill(shipping.phone);
        // await this.page.waitForTimeout(10000);
    }


}

