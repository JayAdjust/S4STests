import { _ } from '../Start/start_controller';
import faker from "faker";
import { SignIn } from './signin_helper';

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