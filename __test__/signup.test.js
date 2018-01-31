import { _ } from '../src/app/modules/StartUp/startUp_controller';
import * as SignUp from '../src/app/modules/SignUp/signUp_controller';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    await SignUp.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});

describe("Signing Up", () => {
    test("Getting to the sign up page", async () => {  
        let page = _.GetPage(); 

        // if we're not in the sign up page, go there!
	    var signUpButtonExists = !!(await page.$('.link-sign-up'));
	    if (signUpButtonExists) {
		    await page.click(".link-sign-up");
	    }
    }, 16000);

    test("Can't sign up with an invalid email (email of: 'testing_bad_email')", async () => {
        expect(await SignUp.Tests.T1()).toBe(true);
    }, 16000);

    test("Can't sign up with a blank email", async() => {
        expect(await SignUp.Tests.T2()).toBe(true);
    }, 16000);

    test("Can't sign up with mismatching passwords", async() => {
        expect(await SignUp.Tests.T3()).toBe(true);
    }, 16000);

    test("Can't sign up with a blank first name", async() => {
        expect(await SignUp.Tests.T4()).toBe(true);
    }, 16000);

    test("Can't sign up with a blank last name", async() => {
        expect(await SignUp.Tests.T5()).toBe(true);
    }, 16000);

    test("Can't sign up with a blank company name", async() => {
        expect(await SignUp.Tests.T6()).toBe(true);
    }, 16000);

    test("Can't sign up with a blank password", async() => {
        expect(await SignUp.Tests.T7()).toBe(true);
    }, 16000);

    test("Can't sign up with a blank confirm password", async() => {
        expect(await SignUp.Tests.T8()).toBe(true);
    }, 16000);

    test("Can't sign up with a password less than 6 characters (testing password: qwert)", async() => {
        expect(await SignUp.Tests.T9()).toBe(true);
    }, 16000);

    test("Able to sign up with a blank language (optional field: will default to English)", async() => {
        expect(await SignUp.Tests.T10()).toBe(true);
    }, 16000);

    test("Able to sign up with a blank birth month (optional field)", async() => {
        expect(await SignUp.Tests.T11()).toBe(true);
    }, 16000);

    test("Able to sign up with a blank birth day (optional field)", async() => {
        expect(await SignUp.Tests.T12()).toBe(true);
    }, 16000);

    test("Able to sign up successfully with all the fields entered correctly", async() => {
        expect(await SignUp.Tests.T13()).toBe(true);
    }, 16000);

    test("Can't sign up with duplicate email", async() => {
        expect(await SignUp.Tests.T14()).toBe(true);
    }, 16000);
});