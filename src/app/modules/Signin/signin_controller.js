import { _ } from '../Start/start_controller';
import faker from "faker";

const VALID_EMAIL = "Jeremy@dicom.com";
const VALID_PASS = "test123";
let page;

export const Tests = {
	Setup: async () => {
		page = _.GetPage();
	},

	T1: async () => {
		return !await onSignIn(await faker.internet.email(), await faker.internet.password());
	},

	T2: async () => {
		return !await onSignIn(VALID_EMAIL, await faker.internet.password());
	},

	T3: async () => {
		return !await onSignIn(VALID_EMAIL, "");
	},

	T4: async () => {
		return !await onSignIn("", "");
	},

	T5: async () => {
		return await onSignIn(VALID_EMAIL, VALID_PASS); 
	},

	T6: async () => {
		return await onLogout();
	}
}

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
async function onSignIn(email, pass) {
	await page.waitFor(1000);

	await page.click("input[name=email]");
	await ClearUsername();
	await page.type("input[name=email]", email, {delay: 50});

	await page.click("input[name=password]");
	await ClearPassword();
	await page.type("input[name=password]", pass, {delay: 50});

	await page.click(".btn.btn-sign-up");
	await page.waitFor(1000);

	return !!(await page.$('.side-bar'));
}
async function onLogout(){
	await page.waitFor(1000);

	await page.click(".nav-profile-options");
	await page.waitFor(1000);

	await page.click(".nav-menu-items div:nth-child(5)");
	await page.waitFor(1000);

	return !(await page.$('.side-bar'));
}