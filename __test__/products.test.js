import { _ } from '../src/app/modules/Start/start_controller';
import * as Products from '../src/app/modules/Products/products_controller';
import { SignIn } from '../src/app/modules/Signin/signin_helper';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    Products.Tests.Setup();

    SignIn.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});

describe("Products", () => {
    /*******************************************************
     *  Pre-Test #1: To test products, you have to sign in first!
     *******************************************************/
    test("Signing in", async () => {
        expect(await SignIn.onSignIn("Jeremy@dicom.com", "test123")).toBe(true);
    }, 16000);

    /*******************************************************
     *  Pre-Test #1: Actually getting to the products page
     *******************************************************/
    test("Actually getting to the products page", async () => {
        expect(await Products.Tests.GoToProducts()).toBe(false); // TODO FIX
    }, 16000);
});