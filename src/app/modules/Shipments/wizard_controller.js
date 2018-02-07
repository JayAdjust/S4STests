import { _ } from '../Start/start_controller';
import { Wizard, Writer } from './shipment_helper';
import faker from "faker";

const PAYMENT_TYPES = {
	prepaid: "PREPAID",
	collect: "COLLECT",
	third_party: "THIRD_PARTY"
};
const ACCOUNTS = {
	ca_parcel: "300030",
	us_parcel: "41562",
	ca_freight: "8292093"
};
const SERVICE_TYPES = {
	air: "AIR",
	ground: "GRD"
};
const PICKUP_POINTS = {
	office: "BU",
	ground_floor: "RC",
	mail_room: "MR",
	other: "OT",
	home: "PH",
	basement: "SS",
	mailbox: "MB"
};
const PICKUP_TIMES = {
	seven_thirty: "7:30",
	eight: "8:00",
	eight_thirty: "8:30",
	nine: "9:00",
	nine_thirty: "9:30",
	ten: "10:00",
	ten_thirty: "10:30",
	eleven: "11:00",
	eleven_thirty: "11:30",
	twelve: "12:00",
	twelve_thirty: "12:30",
	one: "13:00",
	one_thirty: "13:30",
	two: "14:00",
	two_thirty: "14:30",
	three: "15:00",
	three_thirty: "15:30",
	four: "16:00",
	four_thirty: "16:30",
	five: "17:00",
	five_thirty: "17:30",
	six: "18:00",
	six_thirty: "18:30",
	seven: "19:00"
}

const DOMESTIC_PATH = "images/wizard/domestic/";
const XBORDER_PATH = "images/wizard/xborder/";

let page;
let browser;

/**
 * Tests for Jest
 */ 
export const Tests = {
	Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
		Wizard.Setup();

		return page != null && browser != null;
	},
	GenerateDomesticTest: (info) => {
		try{
			DomesticShipmentTest(
				info.name,
				info.from,
				info.to,
				info.payment,
				info.account,
				info.service,
				info.ready,
				info.closing,
				info.point
			);
		}catch(error){}
	}
}
/**
 * Private methods
 */ 

/**
 * DomesticShipementTest will create a shipment and test if all information given and changed
 * 	is valid, as well check if everything was printed.
 * 
 * @param {*} _name Name of the test
 * @param {*} _from the from contact for the shipment
 * @param {*} _to  the to contact for the shipment
 * @param {*} _paymentType the payment type for the shipment
 * @param {*} _account the billing account for the shipment
 * @param {*} _service the service type for the shipment
 * @param {*} _pickupReady the pickup ready by time
 * @param {*} _pickupClosing the pickup closing time
 * @param {*} _pickupPoint the pcikup poitn for the shipment
 */
function DomesticShipmentTest(_name, _from, _to, _paymentType, _account, _service, _pickupReady, _pickupClosing, _pickupPoint){
	describe(_name, () => {
		let account = _account;
		ChangeToWizardTests();
		AddressDetailsTests(_from,_to,_paymentType,_account);
		PackageDetailsTests(_service);
		ConfirmPayTests(_pickupReady, _pickupClosing, _pickupPoint, account, "test");
	});
}

/**
 * ChangeToWizardTests tests to see if the Go to Wizard works
 */
 function ChangeToWizardTests(){
	test("Going to wizard", async () => {
		await Wizard.GoToWizard();
		let element;
		try{
			element = await page.$(".shipping-wizzard");
		}catch(error){}
		expect(element).toBeDefined();
	}, 2500);
 }

 /**
  * AddressDetailsTests tests the address details and validates the information
  * 	to see if everything was properly changed
  */
function AddressDetailsTests(from, to, paymentType, account){
	describe("Address Details", () => {
		// Generate the Addres details (Change all details needed)
		test("Generating Address Details", async () => {
			let errorThrown;
			try{
				await Wizard.AddressDetails(from, to, paymentType, account);
			}catch(error){errorThrown = true;}

			expect(errorThrown).toBeUndefined();
		}, 10000);

		// Validate the changes and if they are valid
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
	
			test("Payment type was select properly", async () => {
				let data = await page.$eval("select[name=payment_type]", (element) => {
					var selected = element.options[element.selectedIndex];
					return selected.getAttribute("value");
				});

				expect(data).toEqual(paymentType);
			}, 1000);

			test("Billing account was selected properly", async () => {
				let data = await page.$eval("select[name=billing_account]", (element) => {
					var selected = element.options[element.selectedIndex];
					return selected.getAttribute("value");
				});

				expect(data).toEqual(account);
			}, 1000);

			test("Able to proceed to package details", async () => {
				let ready = false;
				while(!ready){
					ready = await page.$eval(".btn.next", (element) => {
						return element.innerText == "Next";
					});
				}
	
				await page.click(".btn.next", {waitUntil: 'networkidle'});
				let element;
				try{
					element = await page.$(".packageForm");
				}catch(error){}
				expect(element).toBeDefined();
			}, 5000);
		});
	});
}

/**
 * PackageDetailsTests will test the package details, validate if the information generated and given 
 * 	is valid and chanegd correctly
 */
function PackageDetailsTests(service){
	let packages;
	// PACKAGE DETAILS
	describe("Package Details", () => {
		let packageCount = Math.floor(Math.random() * 3) + 1;
		test("Generating Package Details", async () => {
			try{
				packages = await Wizard.PackageDetails(service, packageCount);
			}catch(error){}
			expect(packages.length).toBeGreaterThan(0);
			expect(packages.length).toBeLessThan(4);
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
	
				await page.click(".btn.next", {waitUntil: 'networkidle'});
				let element;
				try{
					element = await page.$(".confirmation-without-customs");
				}catch(error){}
				expect(element).toBeDefined();
			});
		});
	});
}

/**
 * ConfirmPayTests
 */
function ConfirmPayTests(pickupReady,pickupClosing,pickupPoint,account,path){
	let confirmInfo;
	let popup;
	describe("Confirm and pay", () => {
		test("Generating Confirm and Pay Details", async () => {
			try{
				confirmInfo = await Wizard.ConfirmAndPay(pickupReady, pickupClosing, pickupPoint, account);
			}catch(error){confirmInfo = error}
			expect(confirmInfo).toHaveProperty('references');
			expect(confirmInfo).toHaveProperty('services');
		}, 15000);

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

			test("Able to create the final shipment", async () => {
				let pages = await browser.pages();
				let beforeCount = pages.length;

				let ready = false;
				while(!ready){
					ready = await page.$eval(".final-ship", (element) => {
						return element.innerText == "Ship";
					});
				}
				await page.click(".final-ship", {waitUntil: 'networkidle'});

				pages = await browser.pages();
				while(pages.length < beforeCount + 1){
					await page.waitFor(1000);
					pages = await browser.pages();
				}
				popup = pages.pop();
				expect(popup.url()).toMatch(/blob:*/)
			}, 20000);
		});

		describe("Saving data for human validation", () => {
			test("Taking Screenshot", async () => {
				let errorThrown;
				try{
					await popup.waitFor(2500);

					await popup.screenshot({path: "data/wizard/domestic/"+ path +"/label.png", type: "png", fullPage: true});
					
					await popup.close();
				}catch(error){errorThrown = error;}
				expect(errorThrown).toBeUndefined();
			}, 20000);

			test("Writing Data to files", async () => {
				let errorThrown;
				try{
					await Writer.WriteDataToFile("data/wizard/domestic/" + path + "/data.txt");
				}catch(error){errorThrown = error;}
				expect(errorThrown).toBeUndefined();
			}, 10000);
		});
	});
}