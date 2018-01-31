import { _ } from '../Start/start_controller';
import faker from 'faker';

// Constants
const measurements = ["metric", "imperial"];
const parcelPackages = ["EV", "BX"];
const freightPackages = ["tube","other","baril","skid","box","crate","full","bundle","piece","pallet"];

// FIELDS
let page;
let browser;



/**
 * <Private Functions>
 */
async function GetFromContact(from){
	await page.waitFor(100);
	await page.click(".shipment-container.from input[name=query]");
	await page.type(".shipment-container.from input[name=query]", from);
	await page.waitFor(2000);
	await page.click(".contact-entry-item");
	await page.waitFor(500);
}
async function GetToContact(to){
	await page.waitFor(100);
	await page.click(".shipment-container.to input[name=query]");
	await page.type(".shipment-container.to input[name=query]", to);
	await page.waitFor(2000);
	await page.click(".contact-entry-item");
	await page.waitFor(500);
}

// Function to change billing accounts,
// value: billing account value within the select
async function changeBillingAccount(value){
	await page.select("select[name=billing_account]", value);
}

// Function to change the payment type,
// value: the payment type to change to
async function changePaymentType(type){
	await page.select("select[name=payment_type]", type);
}

// Function to change the pickup date
// value: date to change to
async function changePickupDate(){
	let currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 1);
	await page.select("select[name=pickup_date]",currentDate.toISOString().split('T')[0]);
}

// Function to change the service type
// value: service type
async function changeServiceType(type){
	// GRD OR AIR
	await page.select("select[name=service_type]", type);
}

// Function to change the pickup point
// value: the pickup point value
async function changePickupPoint(value){
	await page.select("select[name=pickup_point]", value);
}

// Function to change the ready by time
// value: the time to change to
async function changePickupReadyBy(value){
	await page.select("select[name=pickup_ready_by]", value);
}

// Function to change the pickup closing time
// value: time to change the pickup closing time to
async function changePickupClosingTime(value){
	await page.select("select[name=pickup_closing_time]", value);
}

// **Function to change the employee number
// value: value to change the employee number to
async function changeEMP(value){
	await page.evaluate(function() {
        document.querySelector('input[name=ui-input-shipment|EMP]').value = "";
    });
	await page.type('input[name=ui-input-shipment|EMP]', value);
}

// **Function to change the invoice number
// value: value to change the invoice number to
async function changeINV(value){
	await page.evaluate(function() {
        document.querySelector('input[name=ui-input-shipment|INV]').value = "";
    });
	await page.type('input[name=ui-input-shipment|INV]', value);
}

// **Function to change the 
// @value:
async function changePON(value){
	await page.evaluate(function() {
        document.querySelector('input[name=ui-input-shipment|PON]').value = "";
    });
	await page.type('input[name=ui-input-shipment|PON]', value);
}

// **Function to change the 
// value:
async function changePRE(value){
	await page.evaluate(function() {
        document.querySelector('input[name=ui-input-shipment|PRE]').value = "";
    });
	await page.type('input[name=ui-input-shipment|PRE]', value);
}

// Function
// service:
async function AddAdditionalService(service){
	switch(service){
		case "HPF":
			await page.click("input[name=HFP]");
			break;
		case "NCV":
			await page.click("input[name=NCV]");
			break;
		case "TRD":
			await page.click("input[name=TRD]");
			break;
		case "WKD":
			await page.click("input[name=WKD]");
			break;
		case "DCV":
			await page.click("input[name=DCV]");
			break;
		default:
			break;
	}
}
async function ChangeMeasurement(measurement){
	await page.click(".control-toggle.weight span:nth-child(1) span:nth-child("+ measurement == "metric"? 2 : 1 +")");
}
async function ChangePackageType(type){
	await page.select("select[name=type]",type);
}
async function ChangePackageQuantity(qty){
	await page.type("input[name=quantity]", "" + qty + "");
}
async function ChangePackageWeight(wght){
	await page.type("input[name=weight]", "" + wght + "");
}
async function ChangePackageDimensions(length, width, height){
	await page.type("input[name=length]", "" + length + "");
	await page.type("input[name=width]", "" + qty + "");
	await page.type("input[name=height]", "" + qty + "");
}
async function ChangePackageInstructions(instructions){
	await page.type("input[name=instructions]", "" + instructions + "");
}

/**
 * </Private Functions>
 */

export const Wizard = {
	Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
	},

	// Function
	// 
	GoToWizard: async() => {
		await page.hover(".menu-item.active.hover-over.shipping");
		await page.waitFor(500);
		await page.click(".sub-routes div:nth-child(2)");
		await page.waitFor(1500)	},

	// Funtion
	AddressDetails: async(from, to, type, account) => {
		await GetFromContact(from);
		await GetToContact(to);
		await changePaymentType(type);
		await changeBillingAccount(account);
		
		await page.waitFor(1000);
		await page.click("#btnNext");
	},
	PackageDetails: async(_package, service) => {
		await ChangeMeasurement(_package.measurement);
		await ChangePackageType(_package.type);
		await ChangePackageQuantity(_package.quantity);
		await ChangePackageWeight(_package.weight);
		await ChangePackageDimensions(_package.length, _package.width, _package.height);
		await ChangePackageInstructions(_package.instructions);
		await changeServiceType(service);

		await changePickupDate();
		await page.waitFor(1500);
		await page.click(".btn.next");
	},
	ParcelPackageRandomizer: () => {
		return {
			type: parcelPackages[Math.floor(Math.random() * parcelPackages.length)],
			mesurement: measurements[Math.floor(Math.random() * measurements.length)],
			quantity: Math.floor(Math.random() * 5) + 2,
			weight: Math.floor(Math.random() * 10) + 1,
			length: Math.floor(Math.random() * 15) + 5,
			width: Math.floor(Math.random() * 15) + 5,
			height: Math.floor(Math.random() * 15) + 5,
			instructions: faker.random.words(3)
		};
	},
	FreightPackageRandomizer: () => {
		return {
			type: freightPackages[Math.floor(Math.random() * freightPackages.length)],
			measurement: measurements[Math.floor(Math.random() * measurements.length)],
			quantity: Math.floor(Math.random() * 5) + 2,
			weight: Math.floor(Math.random() * 10) + 1,
			length: Math.floor(Math.random() * 20) + 5,
			width: Math.floor(Math.random() * 20) + 5,
			height: Math.floor(Math.random() * 20) + 5,
			instructions: faker.random.words(3)
		};
	},
	ConfirmAndPay: async(readyBy, closingTime, pickupPoint) => {
		await changePickupPoint(pickupPoint);
		await changePickupReadyBy(readyBy);
		await changePickupClosingTime(closingTime);
	
		//await Wizard.AddAdditionalService("NCV");
	
		await page.click(".final-ship");
	},
}

export const Quick = {

	// Function
	// 
	GoToQuick: async() => {
		await page.hover(".menu-item.active.hover-over.shipping");
		await page.waitFor(500);
		await page.click(".sub-routes div:nth-child(3)");
	},

	Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
	}
}