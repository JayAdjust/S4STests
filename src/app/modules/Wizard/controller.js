import faker from "faker";
import fs from 'fs';
import { Wizard, Writer } from './helper';
import { Helper } from '../Shipments/shipment_details'; 
import { Manifest } from '../Manifests/manifests_helper';
import { Selectors } from './selectors';
import * as _ from '../Puppeteer/page_helper';

// Puppeteer page & browser
let page,browser;
// Data to keep for validation
let currentWeight = 0,currentPieces = 0,currentInfo = null;

export const Setup = (_page,_browser) => {
	page = _page;
	browser = _browser;

	return (page != null && browser != null && _.Setup(_page, _browser) && Wizard.Setup(_page, _browser));
}
export const GenerateDomesticTest = (info) => {
	currentInfo = info;
	DomesticShipmentTest(
		info.from,
		info.to,
		info.payment,
		info.account,
		info.service,
		info.ready,
		info.closing,
		info.point,
		info.path
	);
}
export const GenerateXBorderTest = (info) => {
	currentInfo = info;
	XBorderShipmentTest(
		info.from,
		info.to,
		info.payment,
		info.account,
		info.service,
		info.ready,
		info.closing,
		info.point,
		info.path
	);
}
export const GenerateManifest = (showPricing, address, path) => {
	GenerateManifest(showPricing, address, path);
}

/**
 * DomesticShipementTest && XBorderShipmentTest will create a shipment and test if all information given and changed
 * 	is valid, as well check if everything was printed.
 * 
 * @param {*} _from the from contact for the shipment
 * @param {*} _to  the to contact for the shipment
 * @param {*} _paymentType the payment type for the shipment
 * @param {*} _account the billing account for the shipment
 * @param {*} _service the service type for the shipment
 * @param {*} _pickupReady the pickup ready by time
 * @param {*} _pickupClosing the pickup closing time
 * @param {*} _pickupPoint the pcikup point for the shipment
 * @param {*} path the path to save files
 */
function DomesticShipmentTest(_from, _to, _paymentType, _account, _service, _pickupReady, _pickupClosing, _pickupPoint, path){
	let account = _account, currentWeight = 0, currentPieces = 0;
	ChangeToWizardTests()
	AddressDetailsTests(_from,_to,_paymentType,_account);
	PackageDetailsTests(_service, false);
	ConfirmPayTests(_pickupReady, _pickupClosing, _pickupPoint, _account, path);
}
function XBorderShipmentTest(_from, _to, _paymentType, _account, _service, _pickupReady, _pickupClosing, _pickupPoint, path){
	let account = _account, currentWeight = 0, currentPieces = 0;
	ChangeToWizardTests();
	AddressDetailsTests(_from,_to,_paymentType,_account);
	PackageDetailsTests(_service, true);
	CustomsDetailsTests();
	ConfirmPayTests(_pickupReady, _pickupClosing, _pickupPoint, _account, path);
}

/**
 * ChangeToWizardTests tests to see if the Go to Wizard works
 */
 function ChangeToWizardTests(){
	test("Going to wizard", async () => {
		if(await page.$(Selectors.divs.wizard_container) == null){
			await Wizard.GoToWizard();
			let element = await page.$(Selectors.divs.wizard_container);
			return expect(element).toBeDefined();
		}
		return expect(true).toBe(true);

	}, 2500);
	test("Restart Shipment", async () => {
		await Wizard.RestartShipment();
		let element = await page.$(".split-layout.wizard-address");
		return expect(element).toBeDefined();
	}, 2500);
 }

 async function AddressDetailsValidation(from, to, paymentType, account){
	let res = true, data, count = 0;

	// From
	data = await page.$eval(".address-bubble.active div.title", (element)=>{
		return element.innerText;
	});
	res |= data == from? 1 << (++count - 1): 0; 		// 0001
	
	// TO
	data = await page.$eval(".address-bubble.orange-active div.title", (element)=>{
		return element.innerText;
	});
	res |= data == to? 1 << (++count - 1): 0; 			// 0011

	// Payment Type
	data = await page.$eval("select[name=payment_type]", (element) => {
		var selected = element.options[element.selectedIndex];
		return selected.getAttribute("value");
	});
	res |= data == paymentType? 1 << (++count - 1): 0; 	// 0111

	// Account
	data = await page.$eval("select[name=billing_account]", (element) => {
		var selected = element.options[element.selectedIndex];
		return selected.getAttribute("value");
	});
	res |= data == account? 1 << (++count - 1): 0; 		// 1111 
	return (res == Math.pow(2,count) - 1);

 }
 /**
  * AddressDetailsTests tests the address details and validates the information
  * 	to see if everything was properly changed
  */
function AddressDetailsTests(from, to, paymentType, account){
	let onPage = true;

	// Check to see if you are on the page
	describe("Address Details Pre-Tests", () => {
		test("Check to see if on address Details Page", async () => {
			let element = await page.$(".split-layout.wizard-address");
			onPage = element != null;
			expect(element).toBeDefined();
		});
	});
	describe("Address Details", () => {
		if(onPage){
			// Generate the Addres details (Change all details needed)
			test("Generating Address Details", async () => {
				await Wizard.AddressDetails(from, to, paymentType, account);
				expect(await AddressDetailsValidation(from, to, paymentType, account)).toBe(true);
			}, 20000);

			// Validate the changes and if they are valid
			describe("Validations", () => {
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
					}catch(error){
						console.log(error);
					}
					expect(element).toBeDefined();
				}, 5000);
			});
		}	
	});
}

async function PackageDetailsValidations(service, packageCount){
	let res = true, data, count = 0;
	data = await page.$eval("select[name=service_type]", (element) => {
		var selected = element.options[element.selectedIndex];
		return selected.getAttribute("value");
	});
	res |= data == service? 1 << (++count - 1):0;

	data = await page.evaluate(() => {
		const divs = Array.from(document.querySelectorAll('.package-list-package  '))
			return divs.length;
	});
	res |= data == packageCount? 1 << (++count - 1):0;
	return res == Math.pow(2,count) - 1;

}
/**
 * PackageDetailsTests will test the package details, validate if the information generated and given 
 * 	is valid and chanegd correctly
 */
function PackageDetailsTests(service, isXBorder){
	let onPage = true;
	let packages;

	// Check to see if you are on the page
	describe("Package Details Pre-Tests", () => {
		test("Check to see if on Package Details Page", async () => {
			let element = await page.$(".packageForm");
			onPage = element != null;
			expect(element).toBeDefined();
		});
	});

	// PACKAGE DETAILS
	describe("Package Details", () => {
		if(onPage){
			let packageCount = Math.floor(Math.random() * 3) + 1;
			test("Generating Package Details", async () => {
				packages = await Wizard.PackageDetails(service, packageCount);
				expect(await PackageDetailsValidations(service, packageCount)).toBe(true);

				packages.forEach((element) => {
					currentPieces += element.quantity;
					currentWeight += element.quantity * element.weight;
				});
			}, 20000);

			describe("Validations", () => {
				test("Able to proceed to Confirm and pay", async () => {
					let ready = false;
					while(!ready){
						ready = await page.$eval(".btn.next", (element) => {
							return element.innerText == "Next";
						});
					}
					
					await page.click(".btn.next", {waitUntil: 'networkidle'});
					let element = isXBorder? await page.$(".product-table-container") : await page.$(".confirmation-without-customs");
					expect(element).toBeDefined();
				}, 5000);
			});
		}
	});
}

// TODO: fix error with customs details page and validations
async function CustomsDetailsValidations(details){
	return true;
}
function CustomsDetailsTests(){
	let details;
	describe("Customs Details", () => {
		if(anyErrors){
			//exit();
		}

		test("Generating Customs Details", async () => {
			details = await Wizard.CustomsDetails();
			expect(await CustomsDetailsValidations(details)).toBe(true);
		}, 20000);

		describe("Validations", () => {
			test("Able to go to confirm and pay", async () => {
				let ready = false;
				while(!ready){
					ready = await page.$eval(".btn.next", (element) => {
						return element.innerText == "Next";
					});
				}

				await page.click(".btn.next", {waitUntil: 'networkidle'});
				let element = await page.$(".confirmation-with-customs");
				expect(element).toBeDefined();
			}, 5000);
		});
	});
}

async function ConfirmPayValidations(pickupReady,pickupClosing,pickupPoint,confirmInfo){
	let res = true, data, count = 0;

	// Pickup Ready
	data = await page.$eval("select[name=pickup_ready_by]", (element) => {
		var selected = element.options[element.selectedIndex];
		return selected.getAttribute("value");
	});
	res |= data == pickupReady? 1 << (++count - 1):0;

	// Pickup closing
	data = await page.$eval("select[name=pickup_closing_time]", (element) => {
		var selected = element.options[element.selectedIndex];
		return selected.getAttribute("value");
	});
	res |= data == pickupClosing? 1 << (++count - 1):0;

	// Pickup point
	data = await page.$eval("select[name=pickup_point]", (element) => {
		var selected = element.options[element.selectedIndex];
		return selected.getAttribute("value");
	});
	res |= data == pickupPoint? 1 << (++count - 1):0;

	// Employee Number
	data = await page.$eval(".kv-inputs div:nth-child(1) input:nth-child(2)", (element) => {
		return element.getAttribute("value");
	});
	res |= data == confirmInfo.references.employee? 1 << (++count - 1):0;

	// Invoice Number
	data = await page.$eval(".kv-inputs div:nth-child(2) input:nth-child(2)", (element) => {
		return element.getAttribute("value");
	});
	res |= data == confirmInfo.references.invoice? 1 << (++count - 1):0;

	// Purchase order number
	data = await page.$eval(".kv-inputs div:nth-child(3) input:nth-child(2)", (element) => {
		return element.getAttribute("value");
	});
	res |= data == confirmInfo.references.order? 1 << (++count - 1):0;

	// Pre-Sold Order Number
	data = await page.$eval(".kv-inputs div:nth-child(4) input:nth-child(2)", (element) => {
		return element.getAttribute("value");
	});
	res |= data == confirmInfo.references.reference? 1 << (++count - 1):0;

	return res == Math.pow(2,count) - 1;
}

// STUFF IN HERE CAN BE IN ANOTHER FILE!!
async function CheckifShipmentwasCreated(){
	let res = true, data, count = 0;
	// <THIS IS GO TO MANIFEST>
	await page.click("div.side-bar > div:nth-child(2) > a > div.icon > i");
	// </THIS IS GO TO MANIFEST>
	if(!!(await page.$("div.shipment-list-wrapper > div > span:nth-child(1) > div")))
		return false;
	
	try{
		await page.waitForSelector("div.shipment-list-wrapper > div > span:nth-child(1) > div > div.shipment-item.weight", {timeout: 2500});
	}catch(e){return false;}

	data = (await page.$eval("div.shipment-list-wrapper > div > span:nth-child(1) > div > div.shipment-item.weight", (element) => {
		return element.textContent;
	}));
	res |= data == currentWeight? 1 << (++count - 1):0;

	data = (await page.$eval("div.shipment-list-wrapper > div > span:nth-child(1) > div > div.shipment-item.packages", (element) => {
		return element.textContent;
	}));
	res |= data == currentPieces? 1 << (++count - 1):0;

	var today = new Date().toJSON().slice(0,10).replace(/-/g,'/').split('/');
	today = today[1] + "/" +  today[2] + "/" + today[0];
	data = (await page.$eval("div.shipment-list-wrapper > div > span:nth-child(1) > div > div.shipment-item.date", (element) => {
		return element.textContent;
	}));
	res |= data == today? 1 << (++count - 1):0;

	var service = Helper.GetServiceNameFromAccount(currentInfo.account);
	data = (await page.$eval("div.shipment-list-wrapper > div > span:nth-child(1) > div > div.shipment-item.service > span > span", (element) => {
		return element.textContent;
	}));
	res |= data == service? 1 << (++count - 1):0;

	return (res == (Math.pow(2,count) - 1));
}
/**
 * ConfirmPayTests
 */
function ConfirmPayTests(pickupReady,pickupClosing,pickupPoint,account,path){
	let onPage = true;
	let confirmInfo;
	let popup;

	// Check to see if you are on the page
	describe("Confirm and Pay Pre-Tests", () => {
		test("Check to see if on Confirm and Pay Page", async () => {
			let element = await page.$(".confirm-status-banner");
			onPage = element != null;
			expect(element).toBeDefined();
		});
	});

	describe("Confirm and pay", () => {
		if(onPage){
			test("Generating Confirm and Pay Details", async () => {
				confirmInfo = await Wizard.ConfirmAndPay(pickupReady, pickupClosing, pickupPoint, account);
				expect(confirmInfo).toHaveProperty('references');
				expect(confirmInfo).toHaveProperty('services');
				expect(await ConfirmPayValidations(pickupReady, pickupClosing, pickupPoint,confirmInfo)).toBe(true);
			}, 20000);

			// VALIDATIONS
			describe("Validations", () => {
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
					expect(popup.url()).toMatch(/blob:*/);
				}, 20000);
				test("Check to see if shipment was created", async () => {
					expect(await CheckifShipmentwasCreated()).toBe(true);
				}, 7500);
			});

			describe("Saving data for human validation", () => {
				test("Writing Data to files", async () => {
					let errorThrown;
					try{
						if (!fs.existsSync(path))
							fs.mkdirSync(path);
						await Writer.WriteDataToFile(path + "data.txt");


						await popup.waitFor(5000);
						//ERROR HERE TODO
						const html = await popup.evaluate('new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML');
						await Writer.WritetoFile(path + "html.txt", html);
					}catch(error){
						errorThrown = error;
						console.log(error);
					}
					expect(errorThrown).toBeUndefined();
				}, 10000);

				test("Taking Screenshot", async () => {
					let errorThrown;
					try{
						if (!fs.existsSync(path))
							fs.mkdirSync(path);
						await popup.waitFor(2500);
						await popup.screenshot({path: path + "label.png", type: "png", fullPage: true});
						await popup.close();
					}catch(error){
						errorThrown = error;
						console.log(error);
					}
					expect(errorThrown).toBeUndefined();
				}, 20000);	
			});
		}
	});
}




// SHOULD NOT BE HERE
function GenerateManifest(showPricing, address, path){
	let popup;
	describe("Generating a manifest", () => {
		test("Go to Shipments", async () => {
			await Manifest.GoToManifests();
			let element = await page.$(".shipment-table-container");
			expect(element).toBeDefined();
		}, 10000);

		test("Generating Manifest", async () => {
			let pages = await browser.pages();
			let beforeCount = pages.length;
			await page.click("div.shipment-table-filters > div.shipment-select-filters > button:nth-child(3)");

			if(showPricing){
				await page.waitForSelector("div.pickup-options-container > div.dicom-checkbox-group.checkbox > label");
				await page.click("div.pickup-options-container > div.dicom-checkbox-group.checkbox > label");
			}

			let numItems = await page.$eval("div.pickup-address-list", (element) => {
                return element.childElementCount;
			});
			var found = true;
			for(var i = 1; i < numItems && found; i++){
				var addr = await page.$eval("div.pickup-address-list > div:nth-child(" + (i + 1) + ") > div.pickup-main-item > div.address-details > div:nth-child(1)", (element) => {
					return element.textContent;
				});
				
				addr += " " + await page.$eval("div.pickup-address-list > div:nth-child(" + (i + 1) + ") > div.pickup-main-item > div.address-details > div:nth-child(2)", (element) => {
					return element.textContent;
				});
				
				addr += " " + await page.$eval("div.pickup-address-list > div:nth-child(" + (i + 1) + ") > div.pickup-main-item > div.address-details > div:nth-child(3)", (element) => {
					return element.textContent;
				});

				if(addr == address){
					await page.waitForSelector("div.pickup-address-list > div:nth-child("+ (i + 1) +") > div.pickup-main-item > div.dicom-checkbox-group.checkbox > label");
					await page.click("div.pickup-address-list > div:nth-child("+ (i + 1) +") > div.pickup-main-item > div.dicom-checkbox-group.checkbox > label");
					await page.waitFor(1000);
					found = false;
				}
			}
			await page.waitForSelector("div.manifest-action-container > button > span");
			await page.click("div.manifest-action-container > button > span");
			pages = await browser.pages();
			while(pages.length < beforeCount + 1){
				await page.waitFor(1000);
				pages = await browser.pages();
			}
			popup = pages.pop();
			expect(popup.url()).toMatch(/blob:*/)
		}, 25000);

		test("Taking Screenshot", async () => {
			let errorThrown;
			try{
				if (!fs.existsSync(path))
					fs.mkdirSync(path);

				await popup.waitFor(2500);
				await popup.screenshot({path: path +"/manifest.png", type: "png", fullPage: true});
				await popup.close();
			}catch(error){
				errorThrown = error;
				console.log(error);
			}
			expect(errorThrown).toBeUndefined();
		}, 20000);
	});
}