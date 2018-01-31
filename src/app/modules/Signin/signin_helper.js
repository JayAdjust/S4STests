import { _ } from '../Start/start_controller';

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
    },
    onSignIn: async (email, pass) => {
	    await page.waitFor(50);
	    await page.click("input[name=email]");
	    await ClearUsername();
	    await page.type("input[name=email]", email);
	    await page.click("input[name=password]");
	    await ClearPassword();
	    await page.type("input[name=password]", pass);
	    await page.click(".btn.btn-sign-up");
	    await page.waitFor(1000);

	    return !!(await page.$('.side-bar'));
    },
    onLogout: async () => {
	    await page.waitFor(1000);
	    await page.click(".nav-profile-options");
	    await page.waitFor(1000);
	    await page.click(".nav-menu-items div:nth-child(5)");
	    await page.waitFor(1000);

	    return !(await page.$('.side-bar'));
    }
}