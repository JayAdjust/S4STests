import { _ } from '../src/app/modules/Start/start_controller';
import * as Wizard from '../src/app/modules/Shipments/wizard_controller';
import { SignIn, DOme } from '../src/app/modules/Signin/signin_helper';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();

    SignIn.Setup();
    Wizard.Tests.Setup();
    await SignIn.onSignIn("Jeremy@dicom.com", "test123");
});

afterAll(() => {
    _.GetBrowser().close();
});

describe("Wizard Domestic Shipment Tests", () => {

});

describe("Wizard XBorder Shipment Tests", () => {
    
});