import { _ } from '../src/app/modules/Start/controller';
import * as Manifests from '../src/app/modules/Manifests/controller';
import { SignIn } from '../src/app/modules/Signin/helper';
import { Shipments } from '../src/app/modules/Shipments/controller';

/**
 * NOTE: for this test to work, please generate ALL non-generated
 * manifest files for the current month. this test requires no manifest files awaiting
 * generation for the start
 */

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    Manifests.Tests.Setup();

    SignIn.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});

describe("Manifests", () => {
    /*******************************************************
     *  Pre-Test #1: To generate manifest, you have to sign in first!
     *******************************************************/
    test("Signing in", async () => {
        expect(await SignIn.onSignIn("Jeremy@dicom.com", "test123")).toBe(true);
    }, 16000);

    /*******************************************************
     *  Pre-Test #2: Go to manifest page
     *******************************************************/
    test("Go to manifest page", async () => {
        expect(await Manifests.Tests.GoToManifest()).toBe(true);
    }, 16000);

    /*******************************************************
     *  Test #1:
     *******************************************************/
    //test("Can't generate manifest with no pickup addresses available (Dicom Parcel Canada)", async () => {
        //var response = await Manifests.Tests.T1(); // needed in another variable
        //expect(response.success).toBe(false);
    //}, 16000);

    /*******************************************************
     *  Test #2:
     *******************************************************/
    //test("Can't generate manifest with no pickup addresses available (Dicom Parcel US)", async () => {
        //var response = await Manifests.Tests.T2();
        //expect(response.success).toBe(false);
    //}, 16000);

    /*******************************************************
     *  Test #3:
     *******************************************************/
    //test("Can't generate manifest with no pickup addresses available (Dicom LTL Canada)", async () => {
        //var response = await Manifests.Tests.T3();
        //expect(response.success).toBe(false);
    //}, 16000);

    /*******************************************************
     *  Test #4: TODO RANDOMIZE NUMBER OF SHIPMENTS
     *******************************************************/
    //test("Create test shipments", async () => {
        //expect(true).toBe(true);
    //}, 16000);

    /*******************************************************
     *  Test #5:
     *******************************************************/
    test("Generate manifests with previous shipments", async () => {
        var response = await Manifests.Tests.T1();
        expect(response.success).toBe(true);
    }, 16000);
});