import { _ } from '../Start/start_controller';

let { page, browser };

export const Contact = {
    SetupPageAndBrowser: async() => {
		page = _.GetPage();
		browser = _.GetBrowser();
	},
    GoToContacts: async () => {
        await page.waitFor(1500);
        await page.hover(".menu-item.hover-over.manage");
        await page.click(".sub-routes div:nth-child(2)");
        await page.waitFor(1500);
    },
}