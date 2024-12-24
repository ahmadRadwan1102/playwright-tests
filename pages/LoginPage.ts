import { Locator, Page } from "@playwright/test";
import { Base } from "./Base";

export class LoginPage extends Base {
    readonly emailField: Locator;
    readonly passField: Locator;
    readonly loginBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.emailField = this.page.locator(`input#email`);
        this.passField = this.page.locator(`fieldset.login input#pass`);
        this.loginBtn = this.page.locator(`.login-container button#send2`);
    }

    async signIn(email: string, pass: string) {
        await this.emailField.fill(email);
        await this.passField.fill(pass);
        await this.loginBtn.click();

    }


}