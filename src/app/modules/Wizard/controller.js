import faker from "faker";
import fs from 'fs';
import * as Writer from '../Writer/controller';
import { Wizard } from './helper';
import { Helper } from '../Shipments/shipment_details'; 
import { Manifest } from '../Manifests/helper';
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
export async function GenerateDomesticTest(info) {
	currentInfo = info;
	try{
		await doChangetoWizard();

		await doAddressDetails(info);
		await doAddressDetailsProceed();

		await doPackageDetails(info);
		await doPackageDetailsProceed(false);

		await doConfirmPay(info);
		await doConfirmPayProceed(info.path);

	}catch(err){ done.fail(err); }
}
export const GenerateXBorderTest = async (info) => {
	currentInfo = info;
	try{
		await doChangetoWizard();

		await doAddressDetails(info);
		await doAddressDetailsProceed();

		await doPackageDetails(info);
		await doPackageDetailsProceed(false);

		//await doCustomsDetails();
		//await doCustomsDetailsProceed();

		await doConfirmPay(info);

	}catch(err){ done.fail(err); }
}
export const GenerateManifestTest = (showPricing, address, path) => {
	GenerateManifest(showPricing, address, path);
}

/**
 * 
 * 			Change to Wizard && Restart Shipment
 * 
 */
export async function doChangetoWizard(){
	if(await page.$(Selectors.divs.wizard_container) == null){
		await Wizard.GoToWizard();
		let element = await page.$(Selectors.divs.wizard_container);
		expect(element).toBeDefined();
	}
	await Wizard.RestartShipment();
	let element = await page.$(".split-layout.wizard-address");
	expect(element).toBeDefined();
}

/**
 * 
 * 			Address Details
 * 
 */
export async function doAddressDetails(shipment){
	currentInfo = shipment;
	await Wizard.AddressDetails(shipment.from, shipment.to, shipment.payment, shipment.account);
	let validation = await Wizard.AddressDetailsValidation(shipment.from, shipment.to, shipment.payment, shipment.account);
	expect(validation).toBe(true);
	return validation;
}
export async function doAddressDetailsProceed(){
	let ready = false;
	while(!ready){
		ready = await page.$eval(".btn.next", (element) => {
			return element.innerText == "Next";
		});
	}
	await page.click(".btn.next", {waitUntil: 'networkidle'});
	expect(!!(await page.$(".packageForm"))).toBe(true);
}

/**
 * 
 *			Package Details 
 * 
 */
export async function doPackageDetails(shipment){
	let packageCount = Math.floor(Math.random() * 3) + 1;
	let packages = await Wizard.PackageDetails(shipment.service, packageCount);
	expect(await Wizard.PackageDetailsValidations(shipment.service, packageCount)).toBe(true);

	packages.forEach((element) => {
		currentPieces += element.quantity;
		currentWeight += element.quantity * element.weight;
	});
}
export async function doPackageDetailsProceed(isXBorder){
	let ready = false;
	while(!ready){
		ready = await page.$eval(".btn.next", (element) => {
			return element.innerText == "Next";
		});
	}
	
	await page.click(".btn.next", {waitUntil: 'networkidle'});
	let element = isXBorder? await page.$(".product-table-container") : await page.$(".confirmation-without-customs");
	expect(element).toBeDefined();
}


/**
 * 
 *			Confirm And Pay 
 * 
 */
export async function doConfirmPay(shipment){
	let confirmInfo = await Wizard.ConfirmAndPay(shipment.ready, shipment.closing, shipment.point, shipment.account);
	expect(confirmInfo).toHaveProperty('references');
	expect(confirmInfo).toHaveProperty('services');
	expect(await Wizard.ConfirmPayValidations(shipment.ready, shipment.closing, shipment.point, confirmInfo)).toBe(true);
}
export async function doConfirmPayProceed(path){
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
	let popup = pages.pop();
	expect(popup.url()).toMatch(/blob:*/);
	expect(await Wizard.CheckifShipmentwasCreated()).toBe(true);

	try{
		if (!fs.existsSync(path))
			fs.mkdirSync(path);
		await Wizard.WriteToFile(path + "data.txt");


		//await popup.waitFor(5000);
		//ERROR HERE TODO
		//const html = await popup.evaluate('new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML');
		//await Writer.WritetoFile(path + "html.txt", html);
	}catch(err){ done.fail(err); }

	try{
		if (!fs.existsSync(path))
			fs.mkdirSync(path);
		await popup.waitFor(2500);
		await popup.screenshot({path: path + "label.png", type: "png", fullPage: true});
		await popup.close();
	}catch(err){ done.fail(err); }
}

/**
 * 
 * 			Customs Details
 *  
 */
// TODO: fix error with customs details page and validations
function CustomsDetailsTests(){
	let details;
	describe("Customs Details", () => {
		if(anyErrors){
			//exit();
		}

		test("Generating Customs Details", async () => {
			details = await Wizard.CustomsDetails();
			expect(await Wizard.CustomsDetailsValidations(details)).toBe(true);
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