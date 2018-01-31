import { _ } from '../src/app/modules/StartUp/startUp_controller';
import * as SignIn from '../src/app/modules/SignIn/signIn_controller';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    await SignIn.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});

describe("Sign In/Logout", () => {
    test("Signing in with an invalid email", async () => {
        let result = await SignIn.Tests.T1();
        expect(result).toBe(true);
    }, 16000);

    test("Signing in with an invalid password", async () => {
        let result = await SignIn.Tests.T2();
        expect(result).toBe(true);
    }, 16000);

    test("Signing in with a blank password", async () => {
        let result = await SignIn.Tests.T3();
        expect(result).toBe(true);
    }, 16000);

    test("Signing in with no email or password", async () => {
        let result = await SignIn.Tests.T4();
        expect(result).toBe(true);
    }, 16000);

    test("Signing in with valid credentials", async () => {
        let result = await SignIn.Tests.T5();
        expect(result).toBe(true);
    }, 16000);
/*
    test("Logout", async () => {
        expect().toBe(true);
    }, 16000);
*/
});