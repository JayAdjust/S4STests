import { _ } from '../Start/start_controller';

let page;
let browser;

export const Manifest = {
    Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
    }
};