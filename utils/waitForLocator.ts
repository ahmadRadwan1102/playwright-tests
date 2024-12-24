import { Locator } from "@playwright/test";

export async function waitForLocator(locator: Locator): Promise<boolean> {
    try {
        await locator.waitFor({ state: 'visible', timeout: 2000 });
        return true; // Return true if the shipping address is visible
    } catch (error) {
        // Return false if the shipping address is not visible within the timeout
        return false;
    }
}