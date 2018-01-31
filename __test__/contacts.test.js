import { _ } from '../src/app/modules/Start/start_controller';
import * as Contacts from '../src/app/modules/Contacts/contacts_controller';
import { SignIn } from '../src/app/modules/Signin/signin_helper';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    SignIn.Setup();
    Contacts.Tests.Setup();
    await SignIn.onSignIn("Jeremy@dicom.com", "test123");
});

afterAll(() => {
    _.GetBrowser().close();
});


describe("Contacts", () => {
    test("test", async () => {
        expect(await Contacts.Tests.T1()).toBe(true);
    }, 16000);
});