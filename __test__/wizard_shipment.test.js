import { _ } from '../src/app/modules/Start/start_controller';
import * as Wizard from '../src/app/modules/Shipments/wizard_controller';
import * as Helper from '../src/app/modules/Shipments/shipment_helper';
import { SignIn } from '../src/app/modules/Signin/signin_helper';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();

    SignIn.Setup();
    Wizard.Tests.Setup();
    Helper.Wizard.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});

describe("Pre-tests", () => {
    /*******************************************************
     *  Pre-Test:
     *******************************************************/
    test("Signing in", async () => {
        expect(await SignIn.onSignIn("Jeremy@dicom.com", "test123")).toBe(true);
    });
});

describe("Wizard Domestic Shipment Pre-made Tests", () => {

    test("test", async () => {
        expect(await Wizard.Domestic.T1()).toBe(true);
    }, 100000);
});

describe("Wizard XBorder Shipment Pre-made Tests", () => {

    test("test", async () => {
        expect(await Wizard.XBorder.T1()).toBe(true);
    }, 100000);
});