import { _ } from '../Start/controller';
import { SignUp } from './helper';
import faker from "faker";

const MIN_PASSWORD_LENGTH = 6;

let page;
let browser;
let duplicateEmail;

export const Tests = {
	Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
		duplicateEmail = faker.internet.email();
		SignUp.Setup();
	},
	GoToSignUp: async () => {
		await page.click(".link-sign-up");
		return true; // TODO actually return value
	},
	T1: async () => {
		return await SignUp.onSignUp("testing_bad_email", true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English");
	},
	T2: async () => {
		return await SignUp.onSignUp("", true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English");
	},
	T3: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty2", "May", "2", "English");
	},
	T4: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, faker.company.companyName(), "", faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English");
	},
	T5: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, faker.company.companyName(), faker.name.firstName(), "", "qwerty", "qwerty", "May", "2", "English");
	},
	T6: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, "", faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English");
	},
	T7: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "", "qwerty", "May", "2", "English");
	},
	T8: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "", "May", "2", "English");
	},
	T9: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwert", "qwert", "May", "2", "English");
	},
	T10: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "");
	},
	T11: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "", "2", "English");
	},
	T12: async () => {
		return await SignUp.onSignUp(faker.internet.email(), true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "", "English");
	},
	T13: async () => {
		return await SignUp.onSignUp(duplicateEmail, true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "Sep", "7", "English");
	},
	T14: async () => {
		return await SignUp.onSignUp(duplicateEmail, true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "Sep", "7", "English");
	}
}