import { _ } from '../StartUp/startUp_controller';
import { Log } from '../Logging/logging';
import faker from "faker";

const VALID_EMAIL = "Jeremy@dicom.com";
const VALID_PASS = "test123";
let page;

export const Tests = {
	Setup: async () => {
		page = _.GetPage();
	},
	ClearTextBoxes: async () => {
		await page.evaluate(function() {
			document.querySelector('input[name=email]').value = "";
			document.querySelector('input[name=password]').value = "";
		});
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
	}
}

export const Run = async() => {
	page = _.GetPage();

	Log.print("Signing in...");
	await onSignIn();
	Log.printLine("Done");
}

export const Working = async(email, password) => {
	Log.print("Signing in...");
	await page.waitFor(1500);

	await page.type("input[name=email]", VALID_EMAIL, {delay: 100});
	await page.type("input[name=password]", VALID_PASS, {delay: 100});
	await page.click(".btn.btn-sign-up");

	Log.printLine("Done");
	await page.waitFor(1500);
}

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
	await page.waitFor(1500);

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