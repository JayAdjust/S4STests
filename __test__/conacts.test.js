import { _ } from '../src/app/modules/Start/start_controller';
import * as Contacts from '../src/app/modules/Contacts/contacts_controller';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    await Contacts.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});


describe("Sign In/Logout", () => {
});