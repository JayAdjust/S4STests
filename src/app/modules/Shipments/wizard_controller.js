import { _ } from '../Start/start_controller';
import { Wizard } from './shipment_helper';
import faker from "faker";
import fs from 'fs';

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
 * Private methods
 */ 
/*
async function RestartShipment(){
	await Wizard.GoToWizard();
	await page.click(".dicon-redo");
	await page.waitForSelector(".shipping-wizzard", {timeout: 10000, visible: true});
}
async function WriteTitle(title, stream){
	for(var i = 0; i < 25; i++)
		stream.write("=")
	stream.write(title);
	for(var i = 0; i < 25; i++)
		stream.write("=")
	stream.write("\n");
}
async function WriteDataToFile(packages, refsAndServices, name){
	let stream = fs.createWriteStream(DOMESTIC_PATH + name + ".txt");
	stream.once('open', () => {
		// PACKAGES
		WriteTitle("Packages", stream);
		for(var i = 0; i < packages.length; i++){
			stream.write("Package #" + i + "\n");
			stream.write("\tType: " + packages[i].type + "\n");
			stream.write("\tQuantity: " + packages[i].quantity + "\n");

			if(packages[i].type != "EV"){
				stream.write("\tWeight: " + packages[i].weight + "\n");
				stream.write("\tLength: " + packages[i].length + "\n");
				stream.write("\tWidth: " + packages[i].width + "\n");
				stream.write("\tHeight: " + packages[i].height + "\n");
			}
			stream.write("\tInstructions: " + packages[i].instructions + "\n");
		}

		// REFERENCES
		WriteTitle("References", stream);
		let refs = refsAndServices.references;
		stream.write("\tEmployee Number: " + refs.employee + "\n");
		stream.write("\tInvoice Number: " + refs.invoice + "\n");
		stream.write("\tPurchase Order number" + refs.order + "\n");
		stream.write("\tPre-Sold Order Reference #" + refs.reference + "\n");


		// SERVICES
		WriteTitle("Services", stream);
		let services = refsAndServices.services;
		services.forEach((service) => {
			stream.write("\t" + service + "\n");
		});
	});
}

async function CreateDomesticShipment(from, to, type, account, serviceType, pickupReady, pickupClosing, pickupPoint, name){
	let pages = await browser.pages();
	let beforeCount = pages.length;

	// Go to wizard
	await Wizard.GoToWizard();

	// Address Details
	await Wizard.AddressDetails(from, to, type, account);
	// Wait for the button to activate
	await page.waitFor(3000);
	await page.click(".btn.next");
	await page.waitFor(1000);

	if(!(await page.$(".packageForm")))
		return false;

	// Package Details
	let packages = await Wizard.PackageDetails(serviceType, Math.floor(Math.random() * 3) + 1);
	await page.waitFor(3000);
	await page.click(".btn.next");
	await page.waitFor(1000);
	if(!(await page.$(".confirm-status-banner")))
		return false;
	
	// Confirm & Pay
	let refsAndServices = await Wizard.ConfirmAndPay(pickupReady, pickupClosing, pickupPoint);

	await page.waitFor(3000);
	await page.click(".final-ship");

	// Printing validation here
	pages = await browser.pages();
	while(pages.length < beforeCount + 1){
		await page.waitFor(1000);
		pages = await browser.pages();
	}

	let popup = pages.pop();
	await popup.waitFor(7500); // Give the popup time to load
	await popup.screenshot({path: DOMESTIC_PATH + name + ".png"});
	await popup.close();

	//WriteDataToFile(packages, refsAndServices, name);

	return true;
}

async function CreateXBorderShipment(from, to, type, account, serviceType, pickupReady, pickupClosing, pickupPoint, name){
	// Go to wizard
	await Wizard.GoToWizard();
	
	// Address Details
	await Wizard.AddressDetails(from, to, type, account);
	// Wait for the button to activate
	await page.waitFor(3000);
	await page.click(".btn.next");
	await page.waitFor(1000);

	if(!(await page.$(".packageForm")))
		return false;

	// Package Details
	let packages = await Wizard.PackageDetails(serviceType, Math.floor(Math.random() * 3) + 1);
	await page.waitFor(1000);

	// Customs Details
	await Wizard.CustomsDetails();
	await page.waitFor(1000);

	// Confirm & Pay
	let refsAndServices = await Wizard.ConfirmAndPay(pickupReady, pickupClosing, pickupPoint);
	
	// Printing validation here
	pages = await browser.pages();
	while(pages.length < beforeCount + 1){
		await page.waitFor(1000);
		pages = await browser.pages();
	}
	let popup = pages.pop();
	await popup.waitFor(7500); // Give the popup time to load
	await popup.screenshot({path: XBORDER_PATH + name + ".png"});
	await popup.close();
	return true;
}
*/
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
	GenerateValidDomesticTest: (info) => {
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

/*
const DOMESTIC_FILENAME_PREFIX = "wizard_domestic_test_";
const XBORDER_FILENAME_PREFIX = "wizard_xborder_test_";
export const Domestic = {
	T1: async () => {
		try {
			return await CreateDomesticShipment("Dicom Shipping Test", "Jeremy Corp", PAYMENT_TYPES.prepaid, ACCOUNTS.ca_parcel, SERVICE_TYPES.ground, 
				PICKUP_TIMES.nine, PICKUP_TIMES.four_thirty, PICKUP_POINTS.ground_floor, DOMESTIC_FILENAME_PREFIX + "one");
		} catch (error) {
			return error;
		}
	},
}

export const XBorder = {
	T1: async () => {
		try {
			return await CreateXBorderShipment("Dicom Shipping Test", "Dicom Eastern Connection - USA", PAYMENT_TYPES.prepaid, ACCOUNTS.ca_parcel, SERVICE_TYPES.ground, 
					PICKUP_TIMES.nine, PICKUP_TIMES.four_thirty, PICKUP_POINTS.ground_floor, XBORDER_FILENAME_PREFIX + "one");
		} catch (error) {
			return error;
		}
	},
}
*/

// Private function
function DomesticShipmentTest(_name, _from, _to, _paymentType, _account, _service, _pickupReady, _pickupClosing, _pickupPoint){
	describe(_name, () => {
		let account = _account;
		test("Going to wizard", async () => {
			await Wizard.GoToWizard();
			let element;
			try{
				element = await page.$(".shipping-wizzard");
			}catch(error){}
			expect(element).toBeDefined();
		}, 2500);
	
		// Address Details
		describe("Address Details", () => {
			let from = _from;
			let to = _to;
			let paymentType = _paymentType;

			test("Generating Address Details", async () => {
				let errorThrown;
				try{
					await Wizard.AddressDetails(from, to, paymentType, account);
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
		
				// TEST ACCOUTN AND PAYMENT TYPE

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
			let service = _service;
			let packageCount = Math.floor(Math.random() * 3) + 1;
			test("Generating Package Details", async () => {
				try{
					packages = await Wizard.PackageDetails(service, packageCount);
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
			let pickupReady = _pickupReady;
			let pickupClosing = _pickupClosing;
			let pickupPoint = _pickupPoint;
			test("Generating Confirm and Pay Details", async () => {
				try{
					confirmInfo = await Wizard.ConfirmAndPay(pickupReady, pickupClosing, pickupPoint, account);
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
	});
}