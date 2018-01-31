import { _ } from '../Start/start_controller';
import { Log } from '../Logging/logging';
import { Wizard } from './shipment_helper';

let page;
let browser;

// Private methods
async function CreateDomesticShipment(from, to, type, account){
	await Wizard.GoToWizard();

	// Address Details
	await Wizard.AddressDetails(from, to, type, account);

	// Package Details
	await Wizard.PackageDetails(false);

	// Confirm & Pay
	await Wizard.ConfirmAndPay("9:00", "17:00", "RC");
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
export const Tests = {
	Setup: async () => {

	},

	T1: async () => {
		
	}
}
export const Run = async() => {
	page = _.GetPage();
	browser = _.GetBrowser();

	await Wizard.SetupPageAndBrowser(page, browser);

	// TODO: Add a bunch of test scenarios
	!XBorder? await CreateDomesticShipment("Dicom shipping test","CA", "PREPAID", "300030") 
		: await CreateXBorderShipment("Dicom shipping test", "phoenix");
}