import { _ } from '../Start/start_controller';

let page;
let browser;

export const Contact = {
    Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
	},
    GoToContacts: async () => {
        await page.waitFor(1000);
        await page.hover(".menu-item.hover-over.manage");
        await page.waitFor(500);
        await page.click(".sub-route div:nth-child(1)");
        await page.waitFor(1000);

        return !!(await page.$(".manage-contacts-header"));
    },
}