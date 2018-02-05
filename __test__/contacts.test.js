import { _ } from '../src/app/modules/Start/start_controller';
import * as Contacts from '../src/app/modules/Contacts/contacts_controller';
import { SignIn } from '../src/app/modules/Signin/signin_helper';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    Contacts.Tests.Setup();

    SignIn.Setup();
    Contacts.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});


describe("Contacts", () => {
    /*******************************************************
     *  Pre-Test #1: To access the contacts page, you have to sign in first!
     *******************************************************/
    test("Signing in", async () => {
        expect(await SignIn.onSignIn("Jeremy@dicom.com", "test123")).toBe(true);
    }, 16000);

    /*******************************************************
     *  Pre-Test #2: Actually getting to the contacts page
     *******************************************************/
    test("Getting to the contacts page", async () => {
        expect(await Contacts.Tests.T1()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #1:
     *******************************************************/
    test("Creating a contact with an invalid address", async () => {
        expect(await Contacts.Tests.T2()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #2:
     *******************************************************/
    test("Creating a contact with a blank address", async () => {
        expect(await Contacts.Tests.T3()).toBe(false);
    }, 16000);

    /*******************************************************
     *  Test #3:
     *******************************************************/
    test("Creating a contact with a blank company name", async () => {
        expect(await Contacts.Tests.T4()).toBe(false);
    }, 16000);
});