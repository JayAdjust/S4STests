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

let page;
let browser;
/**
 * Private methods
 */ 
async function CreateDomesticShipment(from, to, type, account, serviceType, pickupReady, pickupClosing, pickupPoint, emp, inv, pon, pre){
	await Wizard.GoToWizard();

	// Address Details
	await Wizard.AddressDetails(from, to, type, account);

	if(!!(await page.$("select[name=type]")))
		return false;

	let package_details = account != ACCOUNTS.ca_freight ? Wizard.ParcelPackageRandomizer() : Wizard.FreightPackageRandomizer();

	console.log(package_details);

	// Package Details
	await Wizard.PackageDetails(package_details, serviceType);

	// Confirm & Pay
	//await Wizard.ConfirmAndPay("9:00", "17:00", "RC");

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
					"9:00", "14:00", PICKUP_POINTS.ground_floor, "1", "1", "1", "1");
	},
}

export const XBorder = {
	T1: async () => {
		
	},
}