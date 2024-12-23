import { expect, Locator, Page } from "@playwright/test";
import { Base } from "./Base";

export class LoginPage extends Base {
    constructor(page: Page) {
        super(page);
    }

    async signIn(email: string, pass: string) {
        await this.page.locator(`input#email`).fill(email);
        await this.page.locator(`fieldset.login input#pass`).fill(pass);
        await this.page.locator(`.login-container button#send2`).click();

    }


}