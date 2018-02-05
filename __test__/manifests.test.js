import { _ } from '../src/app/modules/Start/start_controller';
import * as Manifests from '../src/app/modules/Manifests/manifests_controller';
import { SignIn } from '../src/app/modules/Signin/signin_helper';

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
});