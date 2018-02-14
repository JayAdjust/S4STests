import { _ } from '../Start/controller';

let page;
let browser;

export const Product = {
    Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
    },
    GoToProducts: async () => {
        // hover over the "Manage" section in the sidebar
        await page.hover(".menu-item.hover-over.manage");
        await page.waitFor(500);

        // click the 2st item that appears (Products)
        await page.click(".sub-routes div:nth-child(3) a");
        await page.waitFor(300);

        return !!(await page.$(".delete-products-icon"));
    },
    onCreateProduct: async (productCode, productName, description, harmonizedCode, unitPrice, isCAD, countryOfOrigin, restrictions, groups) => {
        // click the "Add Product" button
        await page.click(".dicon-add-new");
        await page.waitFor(50);

        // enter product code
        await page.focus("input[name=product_code]");
        await page.waitFor(5);
        await page.type("input[name=product_code]", productCode);

        // enter product name
        await page.focus("input[name=name]");
        await page.waitFor(5);
        await page.type("input[name=name]", productName);

        // enter description
        await page.focus("input[name=description]");
        await page.waitFor(5);
        await page.type("input[name=description]", description);

        // enter harmonized code
        if (harmonizedCode !== "") {
            await page.focus("input[name=harmonized_code]");
            await page.waitFor(5);
            await page.type("input[name=harmonized_code]", harmonizedCode);
        }

        await page.waitFor(5000);
        return true;
    }
};