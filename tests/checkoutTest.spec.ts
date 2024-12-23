import { test, expect, Page } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { addProductToCart } from '../utils/addProductToCart';
import { Shipping } from '../utils/ShipingType';
import { authenticate } from '../utils/authenticate';
require('dotenv').config();

//const URL = 'https://magento.softwaretestingboard.com';

const EMAIL = process.env.EMAIL!;
const PASSWORD = process.env.PASSWORD!;
const dummyShipping: Shipping = {
    email: "ahmad@example.com",
    fName: "ahmad",
    lName: "reda",
    Company: "Tech Solutions Inc.",
    Street1: "123 Main Street",
    Street2: "Apt 4B",
    Street3: "",
    city: "zarqa",
    State: "",
    zipCode: "90001",
    Country: "JO",
    phone: "123-456-7890"
};

let productPage: ProductPage;
let checkoutPage: CheckoutPage;
let sharedPage: Page; // Shared page instance
let orderNumber: string; 
let price: string;

test.describe.configure({ mode: 'serial' });

//Function to verify checkout and order placement
async function finishCheckoutAndPlaceOrder(isAuthRequired: boolean) {
    const shippingAddress = '.shipping-address-item';
    //Check if the shipping address is not already filled
    await sharedPage.waitForTimeout(500); // search for something to wait dynmaic 

    const isShippingFilled = await sharedPage.isVisible(shippingAddress);

    if (!isShippingFilled) {
        //Fill in shipping details if not already filled
        await checkoutPage.fillShippingAddress(dummyShipping);
    }
    
    // proceed to the payment step
    const nextButton = sharedPage.locator('button.continue');
    await nextButton.scrollIntoViewIfNeeded();  

    await expect(nextButton).toBeVisible();
    await sharedPage.waitForTimeout(2000);
    //await sharedPage.locator('div.checkout-shipping-method').waitFor({state: 'visible'})
    await nextButton.click();

    // await sharedPage.waitForLoadState('networkidle')
    // await nextButton.click();
    

    await expect(sharedPage).toHaveURL(/.*\/checkout\/#payment.*/);

    // get price 
    const price = await sharedPage.locator(`td[data-th='Order Total']  span.price`).innerText()


    // place order 
    const placeOrderButton = sharedPage.locator('button[title="Place Order"]');
    await expect(placeOrderButton).toBeVisible();
    await placeOrderButton.click();

    // assert thank msg and order number 
    await expect(sharedPage).toHaveURL(/.*\/checkout\/onepage\/success/);
    await sharedPage.pause()
    const thanksMsg = sharedPage.locator('h1.page-title > span');
    await expect(thanksMsg).toHaveText('Thank you for your purchase!');

    const orderNumber = sharedPage.locator('.checkout-success > p:first-child'); 
    await expect(orderNumber).toBeVisible();
    const orderNumberTextSelector = isAuthRequired ? 'a > strong' : ' > span'
    //console.log(orderNumberTextSelector)
    const orderNumberText = await orderNumber.locator(orderNumberTextSelector).innerText();
    expect(orderNumberText).toMatch(/^\d+$/); // Ensure it's a valid order number

    return { orderNumber: orderNumberText.trim(), price };
}


const URL = 'https://magento.softwaretestingboard.com';

test.describe('Authenticated checkout tests', () => {

    test.beforeAll(async ({ browser }) => {
        // Create a shared browser page
        sharedPage = await browser.newPage();
        await sharedPage.goto(URL, {waitUntil: 'domcontentloaded'});
        productPage = new ProductPage(sharedPage);
        checkoutPage = new CheckoutPage(sharedPage);
        await authenticate(sharedPage, EMAIL, PASSWORD)
        
    });

    test('Verify the checkout proceeds to checkout/#shipping', async () => {
        // Add two products to the cart
        await addProductToCart(productPage);
        //await addProductToCart(productPage, 2);

        await productPage.isDropDownVisible();

        // Proceed to checkout
        const checkoutButton = sharedPage.locator('button#top-cart-btn-checkout');
        await expect(checkoutButton).toBeVisible();
        await checkoutButton.click();

        await expect(sharedPage).toHaveURL(/.*\/checkout\/#shipping.*/);
    });

    test('Finish checkout and place order, verify thank msg shown and the order number', async () => {
        // At this point the shared page is already at /checkout/#shipping
        ({ orderNumber, price } = await finishCheckoutAndPlaceOrder(true));
        console.log(orderNumber, price)
    });

    test('verify that the order visible in order history', async () => {
        await sharedPage.click('div.header button.switch');
        await sharedPage.click('div.header .customer-menu  li:first-child a');

        await sharedPage.locator('.sidebar ul.items .item ')
        .filter({ has: sharedPage.locator('a:has-text("My Orders")') }).click();

        const lastOrder = 'tbody > tr:first-child';
        const lastOrderNumber = sharedPage.locator(`${lastOrder} > td[data-th='Order #']`)
        const lastOrderPrice = sharedPage.locator(`${lastOrder} > td[data-th="Order Total"]`)
        await expect(lastOrderNumber).toHaveText(orderNumber);
        await expect(lastOrderPrice).toHaveText(price)
    })


    test.afterAll(async () => {
        // Clean up the shared page after all tests
        await sharedPage.close();
    });
});
