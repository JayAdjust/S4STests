import { _ } from '../src/app/modules/Start/start_controller';
import * as Wizard from '../src/app/modules/Shipments/wizard_controller';
import * as Helper from '../src/app/modules/Shipments/shipment_helper';
import { SignIn } from '../src/app/modules/Signin/signin_helper';
import { PAYMENT_TYPES, ACCOUNTS, SERVICE_TYPES, PICKUP_POINTS, PICKUP_TIMES} from '../src/app/modules/Shipments/shipment_details';
import * as Contact from '../src/app/modules/Contacts/contacts_controller';

function RandomizeShipment(id){
    return {
        shipment_id: id,
        from: contacts[Math.floor(Math.random() * contacts.length)],
        to: contacts[Math.floor(Math.random() * contacts.length)],
        payment: PAYMENT_TYPES.array[Math.floor(Math.random() * PAYMENT_TYPES.array.length)],
        account: ACCOUNTS.array[Math.floor(Math.random() * ACCOUNTS.array.length)],
        service: SERVICE_TYPES.array[Math.floor(Math.random() * SERVICE_TYPES.array.length)],
        ready: PICKUP_TIMES.array[Math.floor(Math.random() * PICKUP_TIMES.array.length)],
        closing: PICKUP_TIMES.array[Math.floor(Math.random() * PICKUP_TIMES.array.length)],
        point: PICKUP_POINTS.array[Math.floor(Math.random() * PICKUP_POINTS.array.length)],
    }
}
function GetComparableTime(_time, subtracter = 0){
    var d = new Date();
    var time = _time.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    d.setHours( parseInt(time[1]) + (time[3] ? 12 : 0) - subtracter );
    d.setMinutes( parseInt(time[2]) || 0 );
    return d;
}

// Before and After All
beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
});
afterAll(() => {
    _.GetBrowser().close();
});

// Before and After each test
beforeEach(() => {
    count++;
});
afterEach(() => {
    //console.log(res.toString(2));
});
// This gets the result of each test, if it failed it will bitshift to results,
// If anything fails after every describe it will exit testing
const reporter = {
    specDone: async (result) => {
      res |= result.status === 'failed'? 0 : 1 << (count - 1);
    },
};
jasmine.getEnv().addReporter(reporter);

const NUMBER_OF_DOMESTIC_SHIPMENTS = 100;
const USERNAME = "Jeremy@dicom.com";
const PASSWORD = "test123";


let page;
let browser;
let contacts = [];
let domestic_shipments = [];
let shipping_test_from;
let res = 0, count = 0;

/*******************************************************
 *  Pre-Test:
 *******************************************************/
describe("Pre-tests", () => {
    afterAll(() => {
        if(res != Math.pow(2, count)-1)
            Wizard.CONTINUE = false;
    });

    test("Page and browser are not null",() => {
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
        expect(await SignIn.onSignIn(USERNAME, PASSWORD)).toBe(true);
    }, 5000);
    test("Package Randomiser bringing the right data back", async() => {
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
    /*test("Getting a list of all contacts", async() => {
        try{
            contacts = await Contact.ContactList.GetContactList();
        }catch(error){
            console.log(error);
        }
        expect(contacts).toBeDefined();
        shipping_test_from = contacts.forEach(element => {
            if(element.company == "Dicom Shipping Test")
                return element;
        });
    }, 120000);*/
    /*test("Generating Domestic Shipment Tests", () => {
        // DOMESTIC SHIPMENT TESTS
        for(var i = 0; i < NUMBER_OF_DOMESTIC_SHIPMENTS; i++){
            let shipment = RandomizeShipment(i);
        
            //check if valid
            if(shipment.from == shipment.to)
                continue;
        
            var skip = shipments.forEach(element => {
                if(shipment.from == element.from && shipment.to == element.to){
                    return true;
                }
                if((GetComparableTime(shipment.ready) >= GetComparableTime(shipment.closing, 2) && 
                    (GetComparableTime(element.ready) >= GetComparableTime(element.closing, 2)))){
                        return true;
                }
            });
            
            if(skip)
                continue;
        
            shipments.push(shipment);
        }
    });*/
});

//test
/*
describe("TEST DOMESTIC PARCEL SHIPMENT", () => {
    let shipment = {
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
});*/

describe("TEST DOMESTIC FREIGHT SHIPMENT", () => {
    let shipment = {
        from: "Dicom Shipping Test",
        to: "101 business",
        payment: PAYMENT_TYPES.prepaid,
        account: ACCOUNTS.ca_freight,
        service: SERVICE_TYPES.ground,
        ready: PICKUP_TIMES.eight,
        closing: PICKUP_TIMES.four_thirty,
        point: PICKUP_POINTS.mailbox
    };
    Wizard.Tests.GenerateDomesticTest(shipment);
});