import { _ } from '../Start/start_controller';

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
        await page.click(".sub-routes div:nth-child(2) a");
        await page.waitFor(300);

        //return !!(await page.$(".manage-contacts-header"));
        await page.waitFor(2000);
        return true; // TODO this check
    }
};