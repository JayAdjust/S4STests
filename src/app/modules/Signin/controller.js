import { _ } from '../Start/controller';
import faker from "faker";
import { SignIn } from './helper';

const VALID_EMAIL = "Jeremy@dicom.com";
const VALID_PASS = "test123";

export const Tests = {
	Setup: () => {
		return SignIn.Setup();
	},
	
	T1: async () => {
		return !await SignIn.onSignIn(await faker.internet.email(), await faker.internet.password());
	},

	T2: async () => {
		return !await SignIn.onSignIn(VALID_EMAIL, await faker.internet.password());
	},

	T3: async () => {
		return !await SignIn.onSignIn(VALID_EMAIL, "");
	},

	T4: async () => {
		return !await SignIn.onSignIn("", "");
	},

	T5: async () => {
		return await SignIn.onSignIn(VALID_EMAIL, VALID_PASS); 
	},

	T6: async () => {
		return await SignIn.onLogout();
	}
}