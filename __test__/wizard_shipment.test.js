import { _ } from '../src/app/modules/Start/start_controller';
import * as Wizard from '../src/app/modules/Shipments/wizard_controller';
import * as Helper from '../src/app/modules/Shipments/shipment_helper';
import { SignIn } from '../src/app/modules/Signin/signin_helper';
import { PAYMENT_TYPES, ACCOUNTS, SERVICE_TYPES, PICKUP_POINTS, PICKUP_TIMES} from '../src/app/modules/Shipments/shipment_details';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
});

afterAll(() => {
    _.GetBrowser().close();
});

let page;
let browser;

/*******************************************************
 *  Pre-Test:
 *******************************************************/
describe("Pre-tests", () => {
    test("Page and browser are not null", () => {
        page = _.GetPage();
        browser = _.GetBrowser();
        
        expect(page && browser).toBeDefined();
    });

    test("Sign In setup", () => {
        expect(SignIn.Setup()).toBe(true);
    });

    test("Wizard setup", () => {
        expect(Wizard.Tests.Setup()).toBe(true);
    });
    test("Helper setup", () => {
        expect(Helper.Wizard.Setup()).toBe(true);
    });
    test("Signing in", async () => {
        expect(await SignIn.onSignIn("Jeremy@dicom.com", "test123")).toBe(true);
    });
    test("Parcel package randomiser", async() => {
        let pkg = Helper.PackageDetails.ParcelPackageRandomizer();
        expect(pkg).toHaveProperty('type');
        expect(pkg).toHaveProperty('measurement');
        expect(pkg).toHaveProperty('quantity');
        expect(pkg).toHaveProperty('weight');
        expect(pkg).toHaveProperty('length');
        expect(pkg).toHaveProperty('width');
        expect(pkg).toHaveProperty('height');
        expect(pkg).toHaveProperty('instructions');
    });
    test("Freight package randomiser", async() => {
        let pkg = Helper.PackageDetails.FreightPackageRandomizer();
        expect(pkg).toHaveProperty('type');
        expect(pkg).toHaveProperty('measurement');
        expect(pkg).toHaveProperty('quantity');
        expect(pkg).toHaveProperty('weight');
        expect(pkg).toHaveProperty('length');
        expect(pkg).toHaveProperty('width');
        expect(pkg).toHaveProperty('height');
        expect(pkg).toHaveProperty('instructions');
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

/*Wizard.GenerateValidDomesticTest(shipment);*/
Wizard.Tests.GenerateValidDomesticTest(shipment);

/*
describe("Generate a Domestic shipment", () => {
    let account = ACCOUNTS.ca_parcel;
    test("Going to wizard", async () => {
        await Helper.Wizard.GoToWizard();
        let element;
        try{
            element = await page.$(".shipping-wizzard");
        }catch(error){}
        expect(element).toBeDefined();
    }, 2500);

    // Address Details
    describe("Address Details", () => {
        let from = "Dicom Shipping Test";
        let to = "Jeremy Corp";

        test("Generating Address Details", async () => {
            let errorThrown;
            try{
                await Helper.Wizard.AddressDetails(from, to, PAYMENT_TYPES.prepaid, account);
            }catch(error){errorThrown = true;}

            expect(errorThrown).toBeUndefined();
        }, 10000);

        describe("Validations", () => {
            test("From Contact selected properly", async () =>{
                let data = await page.$eval(".address-bubble.active div.title", (element)=>{
                    return element.innerText;
                });
                expect(data).toEqual(from);
            }, 1000);
    
            test("To Contact selected properly", async () => {
                let data = await page.$eval(".address-bubble.orange-active div.title", (element)=>{
                    return element.innerText;
                });
                expect(data).toEqual(to);
            }, 1000);
    
            test("Able to proceed to package details", async () => {
                let ready = false;
                while(!ready){
                    ready = await page.$eval(".btn.next", (element) => {
                        return element.innerText == "Next";
                    });
                }
    
                await page.click(".btn.next");
                let element;
                try{
                    element = await page.$(".packageForm");
                }catch(error){}
                expect(element).toBeDefined();
            }, 5000);
        });
    });

    let packages;
    // PACKAGE DETAILS
    describe("Package Details", () => {
        let service = SERVICE_TYPES.ground;
        let packageCount = Math.floor(Math.random() * 3) + 1;
        test("Generating Package Details", async () => {
            try{
                packages = await Helper.Wizard.PackageDetails(service, packageCount);
            }catch(error){}
            expect(packages).toBeDefined();
        }, 15000);

        describe("Validations", () => {
            test("Service was selected properly", async () => {
                let data = await page.$eval("select[name=service_type]", (element) => {
                    var selected = element.options[element.selectedIndex];
                    return selected.getAttribute("value");
                });
    
                expect(data).toEqual(service);
            }, 1000);
    
            test("Correct amount of packages created", async () => {
                let data = await page.evaluate(() => {
                   const divs = Array.from(document.querySelectorAll('.package-list-package  '))
                   return divs.length;
                });
                expect(data).toEqual(packageCount);
            });
    
            test("Able to proceed to Confirm and pay", async () => {
                let ready = false;
                while(!ready){
                    ready = await page.$eval(".btn.next", (element) => {
                        return element.innerText == "Next";
                    });
                }
    
                await page.click(".btn.next");
                let element;
                try{
                    element = await page.$(".confirmation-without-customs");
                }catch(error){}
                expect(element).toBeDefined();
            });
        });
    });

    describe("Confirm and pay", () => {
        let confirmInfo;
        let pickupReady = PICKUP_TIMES.eight;
        let pickupClosing = PICKUP_TIMES.four;
        let pickupPoint = PICKUP_POINTS.office;
        test("Generating Confirm and Pay Details", async () => {
            try{
                confirmInfo = await Helper.Wizard.ConfirmAndPay(pickupReady, pickupClosing, pickupPoint, account);
            }catch(error){}
            expect(confirmInfo).toBeDefined();
        }, 10000);

        // VALIDATIONS
        describe("Validations", () => {
            test("The pickup ready time is valid", async () => {
                let data = await page.$eval("select[name=pickup_ready_by]", (element) => {
                    var selected = element.options[element.selectedIndex];
                    return selected.getAttribute("value");
                });
    
                expect(data).toEqual(pickupReady);
            }, 1000);
    
            test("The pickup closing time is valid", async () => {
                let data = await page.$eval("select[name=pickup_closing_time]", (element) => {
                    var selected = element.options[element.selectedIndex];
                    return selected.getAttribute("value");
                });
    
                expect(data).toEqual(pickupClosing);
            }, 1000);
    
            test("The pickup point is valid", async () => {
                let data = await page.$eval("select[name=pickup_point]", (element) => {
                    var selected = element.options[element.selectedIndex];
                    return selected.getAttribute("value");
                });
    
                expect(data).toEqual(pickupPoint);      
            }, 1000);
    
            test("Employee number is valid", async () => {
                let data = await page.$eval(".kv-inputs div:nth-child(1) input:nth-child(2)", (element) => {
                    return element.getAttribute("value");
                });

                expect(data).toEqual(confirmInfo.references.employee);
            });

            test("Invoice number is valid", async () => {
                let data = await page.$eval(".kv-inputs div:nth-child(2) input:nth-child(2)", (element) => {
                    return element.getAttribute("value");
                });

                expect(data).toEqual(confirmInfo.references.invoice);
            });

            test("Purchase order number is valid", async () => {
                let data = await page.$eval(".kv-inputs div:nth-child(3) input:nth-child(2)", (element) => {
                    return element.getAttribute("value");
                });

                expect(data).toEqual(confirmInfo.references.order);
            });

            test("Pre-Sold order number is valid", async () => {
                let data = await page.$eval(".kv-inputs div:nth-child(4) input:nth-child(2)", (element) => {
                    return element.getAttribute("value");
                });

                expect(data).toEqual(confirmInfo.references.reference);
            });
        });
    });
});*/


/*
describe("Wizard Domestic Shipment Pre-made Tests", () => {

    test("test", async () => {
        expect(await Wizard.Domestic.T1()).toBe(true);
    }, 100000);
});

describe("Wizard XBorder Shipment Pre-made Tests", () => {

    test("test", async () => {
        expect(await Wizard.XBorder.T1()).toBe(true);
    }, 100000);
});*/