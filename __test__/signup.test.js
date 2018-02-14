import { _ } from '../src/app/modules/Start/controller';
import * as SignUp from '../src/app/modules/Signup/controller';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    await SignUp.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});

describe("Signing Up", () => {
    /*******************************************************
     *  Pre-Test:
     *******************************************************/
    test("Getting to the sign up page", async () => {
        expect(await SignUp.Tests.GoToSignUp()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #1:
     *******************************************************/
    test("Can't sign up with an invalid email (email of: 'testing_bad_email')", async () => {
        expect(await SignUp.Tests.T1()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #2:
     *******************************************************/
    test("Can't sign up with a blank email", async() => {
        expect(await SignUp.Tests.T2()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #3:
     *******************************************************/
    test("Can't sign up with mismatching passwords", async() => {
        expect(await SignUp.Tests.T3()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #4:
     *******************************************************/
    test("Can't sign up with a blank first name", async() => {
        expect(await SignUp.Tests.T4()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #5:
     *******************************************************/
    test("Can't sign up with a blank last name", async() => {
        expect(await SignUp.Tests.T5()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #6:
     *******************************************************/
    test("Can't sign up with a blank company name", async() => {
        expect(await SignUp.Tests.T6()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #7:
     *******************************************************/
    test("Can't sign up with a blank password", async() => {
        expect(await SignUp.Tests.T7()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #8:
     *******************************************************/
    test("Can't sign up with a blank confirm password", async() => {
        expect(await SignUp.Tests.T8()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #9:
     *******************************************************/
    test("Can't sign up with a password less than 6 characters (testing password: qwert)", async() => {
        expect(await SignUp.Tests.T9()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #10:
     *******************************************************/
    test("Able to sign up with a blank language (optional field: will default to English)", async() => {
        expect(await SignUp.Tests.T10()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #11:
     *******************************************************/
    test("Able to sign up with a blank birth month (optional field)", async() => {
        expect(await SignUp.Tests.T11()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #12:
     *******************************************************/
    test("Able to sign up with a blank birth day (optional field)", async() => {
        expect(await SignUp.Tests.T12()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #13:
     *******************************************************/
    test("Able to sign up successfully with all the fields entered correctly", async() => {
        expect(await SignUp.Tests.T13()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #14:
     *******************************************************/
    test("Can't sign up with duplicate email", async() => {
        expect(await SignUp.Tests.T14()).toBe(false);
    }, 16000);
});