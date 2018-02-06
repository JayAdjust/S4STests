import { _ } from '../src/app/modules/Start/start_controller';
import * as Manifests from '../src/app/modules/Manifests/manifests_controller';
import { SignIn } from '../src/app/modules/Signin/signin_helper';

/**
 * NOTE: for this test to work 
 * 
 *
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
     *  Test #1: Clear out/generate manifests if there are any
     *******************************************************/
    if (manifestObject.totalManifests === 0) {
        test("Can't generate manifest with no pickup addresses available", async () => {
            expect(manifestObject.success).toBe(false);
        }, 16000);
    } else {
        test("Generate " + manifestObject.manifestsGenerated + " manifests", async () => {
            expect(manifestObject.success).toBe(true);
        }, 16000);
    }
});