import { _ } from '../Start/start_controller';
import faker from "faker";

const MIN_PASSWORD_LENGTH = 6;
let page;
let duplicateEMail;

export const Tests = {
	Setup: async() => {
		page = _.GetPage();
		duplicateEMail = faker.internet.email();
	},

	T1: async () => {
		return !await onSignUp("testing_bad_email", true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English");
	},
	T2: async () => {
		return !await onSignUp("", true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English");
	},
	T3: async () => {
		return !await onSignUp(faker.internet.email(), true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty2", "May", "2", "English");
	},
	T4: async () => {
		return !await onSignUp(faker.internet.email(), true, faker.company.companyName(), 
		"", faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English");
	},
	T5: async () => {
		return !await onSignUp(faker.internet.email(), true, faker.company.companyName(), 
		faker.name.firstName(), "", "qwerty", "qwerty", "May", "2", "English");
	},
	T6: async () => {
		return !await onSignUp(faker.internet.email(), true, "", 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English");
	},
	T7: async () => {
		return !await onSignUp(faker.internet.email(), true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "", "qwerty", "May", "2", "English");
	},
	T8: async () => {
		return !await onSignUp(faker.internet.email(), true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "", "May", "2", "English");
	},
	T9: async () => {
		return !await onSignUp(faker.internet.email(), true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwert", "qwert", "May", "2", "English");
	},
	T10: async () => {
		return await onSignUp(faker.internet.email(), true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "");
	},
	T11: async () => {
		return await onSignUp(faker.internet.email(), true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "", "2", "English");
	},
	T12: async () => {
		return await onSignUp(faker.internet.email(), true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "", "English");
	},
	T13: async () => {
		return await onSignUp(duplicateEMail, true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "Sep", "7", "English");
	},
	T14: async () => {
		return !await onSignUp(duplicateEMail, true, faker.company.companyName(), 
		faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "Sep", "7", "English");
	}
}

// returns true if signed up, false otherwise
async function onSignUp(email, newCompany, companyName, firstName, lastName, password, confirmPassword, birthdayMonth, birthdayDay, language) {
	// enter email
	await page.type("input[name=email]", email);

	// check the "is this a new company?"
	// enter copmpany name
	if (newCompany) {
		await page.click(".checkbox-custom");
		await page.waitFor(500);
		await page.type("input[name=company]", companyName);
	} else {
		await page.type("input[name=code]", companyName);
	}

	// enter first and last names
	await page.type("input[name=first_name]", firstName);
	await page.type("input[name=last_name]", lastName);

	// enter passwords (both password and confirm password)
	await page.type("input[name=password]", password);
	await page.type("input[name=passwordConfirm]", confirmPassword);

	// focus on the next thing to enter to prevent bugs
	await page.focus("select[name='birthdayMonth']");

	// enter birthday and language preferences
	if (birthdayMonth !== "") {
		await page.select("select[name='birthdayMonth']", birthdayMonth);
	}

	if (birthdayDay !== "") {
		await page.select("select[name='birthdayDay']", birthdayDay);
	}

	if (language !== "") {
		await page.select("select[name='lang']", language);
	}

	// click the sign up button
	await page.click(".btn.btn-sign-up");

	// TODO: better error catching
	// check to see if any error exists and store the value for the return
	var textBoxErrorExists = !!(await page.$('.help-block'));
	var didSignUp;

	if (textBoxErrorExists) {
		didSignUp = false;

		// a local error means that no redirect happened
		// refresh to clear the textboxes
		await page.reload();
	} else {
		// if we made it here, the user has been re-directed to a loading screen
		// wait for the program to finish loading and a message to pop up before continuing
		childElements = [undefined];
		while (typeof childElements[0] == "undefined") {
			var childElements = await page.evaluate(() => {
				const tds = Array.from(document.querySelectorAll('.toastr-middle-container'))
				return tds.map(td => td.textContent)
			});

			// add a waitFor so this loop doesn't get run too many times
			await page.waitFor(100);
		}

		var popupMessage = childElements[0];
		didSignUp = popupMessage.startsWith("Success");

		// clear the popup
		await page.waitFor(1000);
		await page.click(".toastr-middle-container");

		// they got re-directed to the home page again
		// click the sign up button
		await page.click(".link-sign-up");

		// since the old fields will still be there, invoke a refresh
		await page.reload();
	}

	// return the result
	return didSignUp;
}