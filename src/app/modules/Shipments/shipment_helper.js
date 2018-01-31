import { _ } from '../Start/start_controller';

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
	await page.click(".shipment-container.to input[name=query]", {delay: TYPING_DELAY});
	await page.type(".shipment-container.to input[name=query]", value);
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
/**
 * </Private Functions>
 */

export const Wizard = {

	// Function
	// 
	GoToWizard: async() => {
		await page.waitFor(1500);
		await page.hover(".menu-item.active.hover-over.shipping");
		await page.click(".sub-routes div:nth-child(2)");
		await page.waitFor(1500);
	},

	// Funtion
	AddressDetails: async(from, to, type, account) => {
		await GetFromContact(from);
		await GetToContact(to);
		await changePaymentType(type);
		await changeBillingAccount(account);
		await page.waitFor(3000);
		await page.click(".btn.next");
	},

	PackageDetails: async(service) => {
		await page.click(".btn.btn-md.btn-secondary.inline");
		await page.click(".btn.btn-md.btn-secondary.inline");
		await page.click(".btn.btn-md.btn-secondary.inline");

		if(service)
			await changeServiceType(service);

		await changePickupDate();
		await page.waitFor(1500);
		await page.click(".btn.next");
	},

	ConfirmAndPay: async(readyBy, closingTime, pickupPoint) => {
		await changePickupPoint(pickupPoint);
		await changePickupReadyBy(readyBy);
		await changePickupClosingTime(closingTime);
	
		//await Wizard.AddAdditionalService("NCV");
	
		await page.click(".final-ship");
	},

	Setup: async() => {
		page = _.GetPage();
		browser = _.GetBrowser();
	}
}

export const Quick = {

	// Function
	// 
	GoToQuick: async() => {
		await page.waitFor(1500);
		await page.hover(".menu-item.active.hover-over.shipping");
		await page.click(".sub-routes div:nth-child(3)");
		await page.waitFor(1500);
	},

	Setup: async() => {
		page = _.GetPage();
		browser = _.GetBrowser();
	}
}