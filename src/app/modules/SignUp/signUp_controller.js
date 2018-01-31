import { _ } from '../StartUp/startUp_controller';
import { Log } from '../Logging/logging';
import faker from "faker";

const MIN_PASSWORD_LENGTH = 6;

let page;

export const Run = async() => {
	page = _.GetPage();
	
	page.click(".link-sign-up");

	Log.startTestSequence("Sign Up");
	await page.waitForSelector(".authForm");
	var numFailed = 0;
	var testAt = 0;

	testAt++;
	await Log.startTest(testAt, "Can't sign up with an invalid email (email of: 'testing_bad_email')");
	if (!await onSignUp("testing_bad_email", faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up with an invalid email address");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Can't sign up with a blank email");
	if (!await onSignUp("", faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up with a blank email");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Can't sign up with mismatching passwords");
	if (!await onSignUp(faker.internet.email(), faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty2", "May", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up mismatching passwords");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Can't sign up with a blank first name");
	if (!await onSignUp(faker.internet.email(), faker.company.companyName(), "", faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up with a blank first name");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Can't sign up with a blank last name");
	if (!await onSignUp(faker.internet.email(), faker.company.companyName(), faker.name.firstName(), "", "qwerty", "qwerty", "May", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up with a blank last name");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Can't sign up with a blank company name");
	if (!await onSignUp(faker.internet.email(), "", faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up with a blank company name");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Can't sign up with a blank password");
	if (!await onSignUp(faker.internet.email(), faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "", "qwerty", "May", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up with a blank password");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Can't sign up with a blank confirm password");
	if (!await onSignUp(faker.internet.email(), faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "", "May", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up with a blank confirm password");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Can't sign up with a password less than " + MIN_PASSWORD_LENGTH + " characters (testing password: qwert)");
	if (!await onSignUp(faker.internet.email(), faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwert", "qwert", "May", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up with a password less than " + MIN_PASSWORD_LENGTH + " characters");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Able to sign up with a blank language (optional field; will default to English)");
	if (await onSignUp(faker.internet.email(), faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Can't sign up with a blank language");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Able to sign up with a blank birth month (optional field)");
	if (await onSignUp(faker.internet.email(), faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "", "2", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Can't sign up with a blank birth month");
		numFailed++;
	}

	testAt++;
	await Log.startTest(testAt, "Able to sign up with a blank birth day (optional field)");
	if (await onSignUp(faker.internet.email(), faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Can't sign up with a blank birth day");
		numFailed++;
	}

	testAt++;
	var duplicateEmailTest = faker.internet.email();
	await Log.startTest(testAt, "Able to sign up successfully with all the fields entered correctly (with email: '" + duplicateEmailTest + "'");
	if (await onSignUp(duplicateEmailTest, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "Sep", "7", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Can't sign up successfully with all the fields entered correctly");
		numFailed++;
	}

	/* TODO
	testAt++;
	await Log.startTest(testAt, "Can't sign up with duplicate email (with email: '" + duplicateEmailTest + "'");
	if (!await onSignUp(duplicateEmailTest, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "Sep", "7", "English")) {
		await Log.testPassed();
	} else {
		await Log.testFailed("Able to sign up with duplicate email");
		numFailed++;
	}
	*/

	Log.endTestSequence("Sign Up", testAt, numFailed);
}

// returns true if signed up, false otherwise
async function onSignUp(email, companyName, firstName, lastName, password, confirmPassword, birthdayMonth, birthdayDay, language) {
    // enter email
	await page.type("input[name=email]", email);

	// check the "is this a new company?"
	await page.click(".checkbox-custom");

	// enter copmpany name
	await page.type("input[name=company]", companyName);

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
	
	// TODO: better error validation
	// check to see if any error exists and store the value for the return
	const errorExists = (!!(await page.$('.help-block') || !!(await page.$('redux-toastr.top-right'))));

	// refresh
	await page.reload();

	// return the result
	return !errorExists;
}