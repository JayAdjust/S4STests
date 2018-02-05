import { _ } from '../src/app/modules/Start/start_controller';
import * as Wizard from '../src/app/modules/Shipments/wizard_controller';
import { SignIn } from '../src/app/modules/Signin/signin_helper';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();

    SignIn.Setup();
    Wizard.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});

describe("Wizard Domestic Shipment Tests", () => {
    /*******************************************************
     *  Pre-Test:
     *******************************************************/
    test("Pre-Tests, Signing in...", async () => {
        expect(await SignIn.onSignIn("Jeremy@dicom.com", "test123")).toBe(true);
    });

    /*******************************************************
     *  Test #1:
     *******************************************************/
    test("test", async () => {
        expect(await Wizard.Domestic.T1()).toBe(true);
    }, 100000);
});
/*
describe("Wizard XBorder Shipment Tests", () => {
    
});*/