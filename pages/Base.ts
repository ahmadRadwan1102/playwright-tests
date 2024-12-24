import { expect, Locator, Page } from "@playwright/test";

export class Base {

    public pageTitleLocator: Locator;
    readonly searchInput: Locator;
    constructor(public page: Page) {
        this.pageTitleLocator = this.page.locator(`span[data-ui-id="page-title-wrapper"]`);
        this.searchInput = this.page.locator(`input#search`)
    }

    async VerifyPage(pageTitle: string) {
        await expect(this.pageTitleLocator).toContainText(pageTitle); // verify user was nagigate to current page
    }

    async searchTo(key: string) {
        await this.searchInput.fill(key);
        await this.page.keyboard.press(`Enter`);
    }

    async AllContainSearchTerm(products: string[], searchTerm: string) {
        for(const product of products){
            if (!product.toLowerCase().includes(searchTerm.toLowerCase())) {
                throw new Error(
                `Unexpected search result. Expected all results to contain "${searchTerm}", but found: "${product}"`
                );
            }
        }
        
    }

    
}