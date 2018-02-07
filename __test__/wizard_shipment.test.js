import { _ } from '../src/app/modules/Start/start_controller';
import * as Wizard from '../src/app/modules/Shipments/wizard_controller';
import * as Helper from '../src/app/modules/Shipments/shipment_helper';
import { SignIn } from '../src/app/modules/Signin/signin_helper';
import { PAYMENT_TYPES, ACCOUNTS, SERVICE_TYPES, PICKUP_POINTS, PICKUP_TIMES} from '../src/app/modules/Shipments/shipment_details';
import * as Contact from '../src/app/modules/Contacts/contacts_controller';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
});

afterAll(() => {
    _.GetBrowser().close();
});

let page;
let browser;
let contacts;

/*******************************************************
 *  Pre-Test:
 *******************************************************/
describe("Pre-tests", () => {
    test("Page and browser are not null", () => {
        page = _.GetPage();
        browser = _.GetBrowser();
        
        expect(page && browser).toBeDefined();
    }, 1000);

    test("Sign In setup", () => {
        expect(SignIn.Setup()).toBe(true);
    }, 1000);

    test("Wizard setup", () => {
        expect(Wizard.Tests.Setup()).toBe(true);
    }, 1000);
    test("Contacts setup", () => {
        expect(Contact.Tests.Setup()).toBe(true);
    }, 1000);
    test("Signing in", async () => {
        expect(await SignIn.onSignIn("Jeremy@dicom.com", "test123")).toBe(true);
    }, 5000);
    test("Parcel package randomiser", async() => {
        let pkg = Helper.PackageDetails.PackageRandomizer();
        expect(pkg).toHaveProperty('type');
        expect(pkg).toHaveProperty('measurement');
        expect(pkg).toHaveProperty('quantity');
        expect(pkg).toHaveProperty('weight');
        expect(pkg).toHaveProperty('length');
        expect(pkg).toHaveProperty('width');
        expect(pkg).toHaveProperty('height');
        expect(pkg).toHaveProperty('instructions');
    }, 1000);
    test("Freight package randomiser", async() => {
        let pkg = Helper.PackageDetails.PackageRandomizer();
        expect(pkg).toHaveProperty('type');
        expect(pkg).toHaveProperty('measurement');
        expect(pkg).toHaveProperty('quantity');
        expect(pkg).toHaveProperty('weight');
        expect(pkg).toHaveProperty('length');
        expect(pkg).toHaveProperty('width');
        expect(pkg).toHaveProperty('height');
        expect(pkg).toHaveProperty('instructions');
    }, 1000);
    test("Getting a list of all contacts", async() => {
        try{
            contacts = await Contact.ContactList.GetContactList();
        }catch(error){
            console.log(error);
        }

        expect(contacts).toBeDefined();
    });
});

//test
let shipment = {
    name: "Just a test shipment",
    from: "Dicom Shipping Test",
    to: "Jeremy Corp",
    payment: PAYMENT_TYPES.prepaid,
    account: ACCOUNTS.ca_parcel,
    service: SERVICE_TYPES.ground,
    ready: PICKUP_TIMES.eight,
    closing: PICKUP_TIMES.four_thirty,
    point: PICKUP_POINTS.mailbox
};

Wizard.Tests.GenerateDomesticTest(shipment);