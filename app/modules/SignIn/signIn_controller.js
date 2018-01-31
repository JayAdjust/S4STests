import { _ } from '../StartUp/startUp_controller';
import { Log } from '../Logging/logging';

const TESTING_EMAIL = "Jeremy@dicom.com";
const TESTING_PASS = "test123";
let page;

export const Run = async() => {
	page = _.GetPage();

	await ValidSignIn();
}

async function ValidSignIn() {
	Log.print("Signing in...");
	await page.waitFor(1500);

	await page.type("input[name=email]", TESTING_EMAIL, {delay: 100});
	await page.type("input[name=password]", TESTING_PASS, {delay: 100});
	await page.click(".btn.btn-sign-up");

	Log.printLine("Done");
	await page.waitFor(1500);
}