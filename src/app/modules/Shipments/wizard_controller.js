import { _ } from '../Start/start_controller';
import { Wizard } from './shipment_helper';

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

let page;
let browser;
/**
 * Private methods
 */ 
async function CreateDomesticShipment(from, to, type, account, serviceType, pickupReady, pickupClosing, pickupPoint, name){
	let pages = await browser.pages();
	let beforeCount = pages.length;

	await Wizard.GoToWizard();

	// Address Details
	await Wizard.AddressDetails(from, to, type, account);
	await page.waitFor(1000);

	if(!(await page.$(".packageForm")))
		return false;

	// Package Details
	let packages = await Wizard.PackageDetails(serviceType, account, Math.floor(Math.random() * 3) + 1);
	await page.waitFor(1000);

	if(!(await page.$(".confirm-status-banner")))
		return false;
	
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
	await popup.screenshot({path: "images/wizard/" + name + ".png"});
	return true;
}

async function CreateXBorderShipment(from, to){
	await Wizard.GoToWizard();
	//await ContactList.GetFromContact(from);
	//await ContactList.GetToContact(to);

	// Change PaymentType & Billing Account
	//await Wizard.changePaymentType("PREPAID"); // just for a test
	//await Wizard.changeBillingAccount("41562"); // just for a test

	await page.waitFor(3000);
	
	// PACKAGE DETAILS
	await page.click(".btn.next");
	await page.click(".btn.btn-md.btn-secondary.inline");
	await page.click(".btn.btn-md.btn-secondary.inline");

	// PRODUCTS PAGE

}

/**
 * Tests for Jest
 */ 
export const Tests = {
	Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
		Wizard.Setup();
	}
}

export const Domestic = {
	T1: async () => {
		return await CreateDomesticShipment("Dicom Shipping Test", "Jeremy Corp", PAYMENT_TYPES.prepaid, ACCOUNTS.ca_parcel, SERVICE_TYPES.ground, 
					PICKUP_TIMES.nine, PICKUP_TIMES.four_thirty, PICKUP_POINTS.ground_floor, "wizard_test_one");
	},
}

export const XBorder = {
	T1: async () => {
		
	},
}