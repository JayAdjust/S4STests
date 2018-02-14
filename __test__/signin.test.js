import { _ } from '../src/app/modules/Start/controller';
import * as SignIn from '../src/app/modules/Signin/controller';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    await SignIn.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});

describe("Sign In/Logout", () => {
    /*******************************************************
     *  Test #1:
     *******************************************************/
    test("Signing in with an invalid email", async () => {
        expect(await SignIn.Tests.T1()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #2:
     *******************************************************/
    test("Signing in with an invalid password", async () => {
        expect(await SignIn.Tests.T2()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #3:
     *******************************************************/
    test("Signing in with a blank password", async () => {
        expect(await SignIn.Tests.T3()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #4:
     *******************************************************/
    test("Signing in with no email or password", async () => {
        expect(await SignIn.Tests.T4()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #5:
     *******************************************************/
    test("Signing in with valid credentials", async () => {
        expect(await SignIn.Tests.T5()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #6:
     *******************************************************/
    test("Logout", async () => {
        expect(await SignIn.Tests.T6()).toBe(true);
    }, 16000);
});