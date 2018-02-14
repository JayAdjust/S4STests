import { _ } from '../Start/controller';

// FIELDS
let page;
let browser;

/**
 * Private Functions
 */
async function ClearUsername(){
	await page.evaluate(function() {
		document.querySelector('input[name=email]').value = "";
	});
}
async function ClearPassword(){
	await page.evaluate(function() {
		document.querySelector('input[name=password]').value = "";
	});
}

export const SignIn = {
    Setup: () => {
        page = _.GetPage();
		browser = _.GetBrowser();
		
		return page != null && browser != null;
    },
    onSignIn: async (email, pass) => {
	    await page.click("input[name=email]");
	    await ClearUsername();
	    await page.type("input[name=email]", email, { delay: 15 });
	    await page.click("input[name=password]");
	    await ClearPassword();
	    await page.type("input[name=password]", pass, { delay: 15 });
	    await page.click(".btn.btn-sign-up");
	    await page.waitFor(1000);

	    return !!(await page.$('.side-bar'));
    },
    onLogout: async () => {
	    await page.waitForSelector(".nav-profile-options");
	    await page.click(".nav-profile-options");
	    await page.waitForSelector(".nav-menu-items div:nth-child(5)");
	    await page.click(".nav-menu-items div:nth-child(5)");
	    await page.waitFor(300);

	    return !(await page.$('.side-bar'));
    }
}