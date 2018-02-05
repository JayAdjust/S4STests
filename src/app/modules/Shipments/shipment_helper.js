import { _ } from '../Start/start_controller';
import faker from 'faker';

// Constants
const measurements = ["metric", "imperial"];
const parcelPackages = ["EV", "BX"];
const freightPackages = ["tube","other","baril","skid","box","crate","full","bundle","piece","pallet"];
const additionalSerivces = ["HPF","NCV","TRD","WKD","DCV"];
const freightServices = ["Appointment","COD","Heating","Hold for pick up Saturday","Hold for pickup",
	"Inside delivery","Private house","Private house pick up","Tailgate","Tailgate pick up", "DCV"];
const purposes = ["COM","PER","DOC","RET"];
const dutyOptions = ["SHIPPER","RECIPIENT","THIRD_PARTY"];
const broker = "cisuu7xyi000o0yghovn49w6u";

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
	await page.waitForSelector(".contact-entry-item", {timeout: 10000, visible: true});
	await page.click(".contact-entry-item");
	await page.waitForSelector(".address-bubble.active", {timeout: 10000, visible: true});
}
async function GetToContact(to){
	await page.waitFor(100);
	await page.click(".shipment-container.to input[name=query]");
	await page.type(".shipment-container.to input[name=query]", to);
	await page.waitForSelector(".contact-entry-item", {timeout: 10000, visible: true});
	await page.click(".contact-entry-item");
	await page.waitForSelector(".address-bubble.orange-active", {timeout: 10000, visible: true});
}

// Function to change billing accounts,
// value: billing account value within the select
async function changeBillingAccount(value){
	await page.waitForSelector("select[name=billing_account]", {timeout: 10000, visible: true});
	await page.select("select[name=billing_account]", value);
}

// Function to change the payment type,
// value: the payment type to change to
async function changePaymentType(type){
	await page.waitForSelector("select[name=payment_type]", {timeout: 10000, visible: true});
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
	await page.click(".kv-inputs div:nth-child(1) input:nth-child(2)");
	await page.evaluate(function() {
		document.querySelector('.kv-inputs div:nth-child(1) input:nth-child(2)').value = "";
	});
	await page.type('.kv-inputs div:nth-child(1) input:nth-child(2)', value);
}

// **Function to change the invoice number
// value: value to change the invoice number to
async function changeINV(value){
	await page.click(".kv-inputs div:nth-child(2) input:nth-child(2)");
	await page.evaluate(function() {
		document.querySelector('.kv-inputs div:nth-child(2) input:nth-child(2)').value = "";
	});
	await page.type('.kv-inputs div:nth-child(2) input:nth-child(2)', value);
}

// **Function to change the 
// @value:
async function changePON(value){
	await page.click(".kv-inputs div:nth-child(3) input:nth-child(2)");
	await page.evaluate(function() {
		document.querySelector('.kv-inputs div:nth-child(3) input:nth-child(2)').value = "";
	});
	await page.type('.kv-inputs div:nth-child(3) input:nth-child(2)', value);
}

// **Function to change the 
// value:
async function changePRE(value){
	await page.click(".kv-inputs div:nth-child(4) input:nth-child(2)");
	await page.evaluate(function() {
		document.querySelector('.kv-inputs div:nth-child(4) input:nth-child(2)').value = "";
	});
	await page.type('.kv-inputs div:nth-child(4) input:nth-child(2)', value);
}

// Function
// service:
async function AddAdditionalService(service){
	switch(service){
		// PARCEL
		case "HPF": await page.click("input[name=HFP]"); break;
		case "NCV": await page.click("input[name=NCV]"); break;
		case "TRD": await page.click("input[name=TRD]"); break;
		case "WKD": await page.click("input[name=WKD]"); break;
		case "DCV": await page.click("input[name=DCV]"); break;

		// FREIGHT
		case "Appointment": await page.click("input[name=Appointment]"); break;
		case "COD": await page.click("input[name=COD]"); break;
		case "Heating": await page.click("input[name=Heating]"); break;
		case "Hold for pick up Saturday": await page.click("input[name=Hold for pick up Saturday]"); break;	
		case "Hold for pickup": await page.click("input[name=Hold for pickup]"); break;	
		case "Inside delivery": await page.click("input[name=Inside delivery]"); break;	
		case "Private house": await page.click("input[name=Private house]"); break;	
		case "Private house pick up": await page.click("input[name=Private house pick up]"); break;	
		case "Tailgate": await page.click("input[name=Tailgate]"); break;
		case "Tailgate pick up": await page.click("input[name=Tailgate pick up]"); break;
		case "DCV": await page.click("input[name=DCV]"); break;
		default: break;
	}
}
async function ChangeMeasurement(measurement){
	if(measurement == "metric")
		await page.click(".control-toggle.weight span:nth-child(1) span:nth-child(2)");
	else
		await page.click(".control-toggle.weight span:nth-child(1) span:nth-child(1)");
}
async function ChangePackageType(type){
	await page.select("select[name=type]",type);
}
async function ChangePackageQuantity(qty){
	// Click on the element trying to edit
	await page.click("input[name=quantity]");
	await page.evaluate(function() {
        document.querySelector("input[name=quantity]").value = "";
    });
	await page.type("input[name=quantity]", qty);
}
async function ChangePackageWeight(wght){
	await page.click("input[name=weight]");
	await page.evaluate(function() {
        document.querySelector("input[name=weight]").value = "";
    });
	await page.type("input[name=weight]", wght);
}
async function ChangePackageDimensions(length, width, height){
	// Length
	await page.click("input[name=length]");
	await page.evaluate(function() {
        document.querySelector("input[name=length]").value = "";
	});
	await page.type("input[name=length]", "" + length + "");

	// Width
	await page.click("input[name=width]");
	await page.evaluate(function() {
        document.querySelector("input[name=width]").value = "";
	});
	await page.type("input[name=width]", width );

	// Height
	await page.click("input[name=height]");
	await page.evaluate(function() {
        document.querySelector("input[name=height]").value = "";
	});
	await page.type("input[name=height]", height);
}
async function ChangePackageInstructions(instructions){
	await page.click("input[name=instructions]");
	await page.evaluate(function() {
        document.querySelector("input[name=instructions]").value = "";
	});
	await page.type("input[name=instructions]", instructions);
}
async function GenerateParcelAdditionalServices(){
	// Generate a random number of services to select
	let numServices = Math.floor(Math.random() * 4);
	// Create an array to send back all services that were added
	let selected = [];
	// add numServices amount of additional services
	for(let i = 0; i < numServices; i++){
		// Get a random service
		let serv = additionalSerivces[Math.floor(Math.random() * additionalSerivces.length)];

		// If it's already selected, continue trying to select another
		if(selected.indexOf(serv) != -1){
			i--;
			continue;
		}
		
		// If WKD or DVC are already select and the current random service is either or,
		// get another due to not being able to do add WKD if DVC, or other way around
		if(serv == "WKD" || serv == "DVC"){
			if(selected.indexOf("WKD") != -1 || selected.indexOf("DVC") != -1){
				i--;
				continue;
			}
		}

		// Add the addtional service if passed everythign else
		await AddAdditionalService(serv);
		// push to the array
		selected.push(serv);
	}

	return selected;
}
async function GenerateFreightAdditionalServices(){
	// Generate a random number of services to select
	let numServices = Math.floor(Math.random() * 5);
	// Create an array to send back all services that were added
	let selected = [];
	// add numServices amount of additional services
	for(let i = 0; i < numServices; i++){
		// Get a random service
		let serv = freightServices[Math.floor(Math.random() * freightServices.length)];

		// If it's already selected, continue trying to select another
		if(selected.indexOf(serv) != -1){
			i--;
			continue;
		}

		// Add the addtional service if passed everythign else
		await AddAdditionalService(serv);
		// push to the array
		selected.push(serv);
	}

	return selected;
}

/**
 * </Private Functions>
 */

export const PackageDetails = {
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
	}
};

let currentAccount;

export const Wizard = {
	Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
	},

	// Function
	// 
	GoToWizard: async() => {
		await page.hover(".menu-item.active.hover-over.shipping");
		await page.waitForSelector(".sub-routes div:nth-child(2)", {timeout: 10000, visible: true});
		await page.click(".sub-routes div:nth-child(2)");
		await page.waitForSelector(".shipping-wizzard", {timeout: 10000, visible: true});
	},

	// Funtion
	AddressDetails: async(from, to, type, account) => {
		// Get the from contact
		await GetFromContact(from);
		// Get the to contact
		await GetToContact(to);
		// Chnage the payment type
		await changePaymentType(type);
		// Change the billing account
		await changeBillingAccount(account);
		
		currentAccount = account;

		// Wait for the button to activate
		await page.waitFor(3000);
		await page.click(".btn.next");
	},
	PackageDetails: async(service, packageCount) => {
		// Create the packages array to return for printing validation
		let packages = [];

		// Create packageCount number of packages
		for(let i=0; i < packageCount; i++){
			// Generate a random package
			let _package = currentAccount != "8292093" ? PackageDetails.ParcelPackageRandomizer() : PackageDetails.FreightPackageRandomizer();

			// Change the type of package
			await ChangePackageType(_package.type);

			// Change the quantity to the package
			await ChangePackageQuantity(_package.quantity.toString());

			// Check to see if the package is an Envelope
			if(_package.type != "EV"){
				// Measurement disabled for now
				//await ChangeMeasurement(_package.measurement);await page.waitFor(1500);
				await ChangePackageWeight(_package.weight.toString());
				await ChangePackageDimensions(_package.length.toString(), _package.width.toString(), _package.height.toString());
			}

			// Change the instructions
			await ChangePackageInstructions(_package.instructions);

			// Change the service type
			await changeServiceType(service);
			// Change the pickup date
			await changePickupDate();

			// Click on add package
			await page.click(".btn.btn-md.btn-secondary.inline");

			// Add package to the array
			packages.push(_package);
		}

		await page.waitFor(3000);
		await page.click(".btn.next");

		return packages;
	},
	CustomsDetails: async() => {
		let details = {
			purpose: purposes[Math.floor(Math.random() * purposes.length)],
			description: faker.random.words(2),
			broker: broker,
			duty: dutyOptions[Math.floor(Math.random() * dutyOptions.length)]
		};

		await page.click("input[name=productName]");
		await page.type("input[name=productName]", "ps3");
		await page.waitForSelector(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a", {timeout: 10000, visible: true});
		await page.click(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a");
	
		// Description
		await page.click("input[name=description]");
		await page.type("input[name=description]", details.description);

		await page.click("input[name=productName]");
		await page.type("input[name=productName]", "knife");
		await page.waitForSelector(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a", {timeout: 10000, visible: true});
		await page.click(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a");

		// Description
		await page.click("input[name=description]");
		await page.type("input[name=description]", details.description);

		await page.waitFor(2000);

		// Purpose
		await page.select("select[name=purpose]", details.purpose);

		// Broker
		await page.select("select[name=broker_id]", details.broker);

		// If duty applies 
		await page.select("select[name=bill_to]", details.duty);

		// Click on next
		await page.waitFor(3000);
		await page.click(".btn.next");

	},
	ConfirmAndPay: async(readyBy, closingTime, pickupPoint) => {
		// Change the pickupPoint
		await changePickupPoint(pickupPoint);
		// Change Pickup ready by
		await changePickupReadyBy(readyBy);
		// Change pickup closing time
		await changePickupClosingTime(closingTime);

		// Generate random references and save them in order to 
		// send them back for validation on printing
		let references = {
			employee: faker.random.number({min: 10000, max: 9999999}).toString(),
			invoice: "INV" + faker.random.number({min: 10000, max: 9999999}),
			order: "ORD" + faker.random.number({min: 10000, max: 9999999}),
			reference: "REF" + faker.random.number({min: 10000, max: 9999999})
		};

		// Change all references
		await changeEMP(references.employee);
		await changeINV(references.invoice);
		await changePON(references.order);
		await changePRE(references.reference);

		let selected = currentAccount != "8292093"? await GenerateParcelAdditionalServices() : await GenerateFreightAdditionalServices();
	
		await page.waitFor(3000);
		await page.click(".final-ship");
		return {references: references, services: selected};
	},
}

export const Quick = {

	// Function
	// 
	GoToQuick: async() => {
		await page.hover(".menu-item.active.hover-over.shipping");
		await page.waitForSelector(".sub-routes div:nth-child(3)");
		await page.click(".sub-routes div:nth-child(3)");
	},

	Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
	}
}