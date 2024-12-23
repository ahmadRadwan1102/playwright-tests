import { ProductPage } from "../pages/ProductPage";
import { getProduct } from './getProduct'

export async function addProductToCart(page: ProductPage, productNum: number = 1): Promise<string> {
    const product = await getProduct(page, productNum);

    const productName = await product.locator('.product-item-details > strong a').innerText();

    await page.addProduct(product);

    return productName;
}