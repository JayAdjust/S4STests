import faker from 'faker';
import fs, { read } from 'fs';
import * as _ from '../Puppeteer/page_helper';
import * as Selectors from '../Puppeteer/page_selectors';


// TODO: Create a module for all puppeteer repetitive uses

// Constants
const measurements = ["metric", "imperial"];
const parcelPackages = ["EV", "BX"];
const freightPackages = ["tube","other","baril","skid","box","crate","full","bundle","piece","pallet"];
const additionalServices = ["HFP","NCV","TRD","WKD","DCV","PHS"];
const freightServices = ["Appointment","COD","Heating","Hold for pick up Saturday","Hold for pickup",
	"Inside delivery","Private house","Private house pick up","Tailgate","Tailgate pick up", "DCV"];
const purposes = ["COM","PER","DOC","RET"];
const dutyOptions = ["SHIPPER","RECIPIENT","THIRD_PARTY"];
const broker = "cisuu7xyi000o0yghovn49w6u";

// FIELDS
let page;
let browser;
let currentpkgs;
let refsServices;
let currentAccount;

/**
 * <Private Functions>
 */
async function ChangeMeasurement(measurement){
	if(measurement == "metric")
		await page.click(".control-toggle.weight span:nth-child(1) span:nth-child(2)");
	else
		await page.click(".control-toggle.weight span:nth-child(1) span:nth-child(1)");
}
async function GenerateAdditionalServices(account){
	// Generate a random number of services to select
	let numServices = Math.floor(Math.random() * 3);
	// Create an array to send back all services that were added
	let selected = [];

	// Check if a private home delivery
	let homeDelivery;
	try{
		homeDelivery = await page.$eval("input[name=PHD]", (element) => {
			return element.checked;
		});
	}catch(error){}

	// add numServices amount of additional services
	for(let i = 0; i < numServices; i++){
		// Get a random service
		let serv = account != "8292093"?  
			additionalServices[Math.floor(Math.random() * additionalServices.length)] : 
			freightServices[Math.floor(Math.random() * freightServices.length)];

		// If it's already selected, continue trying to select another
		if(selected.indexOf(serv) != -1){
			i--;
			continue;
		}

		// If WKD or DVC are already select and the current random service is either or,
		// get another due to not being able to do add WKD if DVC, or other way around
		if(serv == "DCV" || serv == "WKD"){
			if(selected.indexOf("WKD") != -1 || selected.indexOf("DCV") != -1){
				i--;
				continue;
			}
		}

		// If it's a home delivery trade show is not available
		// If it's not a home delivery PHS is not available
		if((serv == "TRD" && homeDelivery) || serv == "PHS" && !homeDelivery)
			continue;

		// Add the addtional service if passed everythign else
		let ready = false;
		while(!ready){
			ready = await page.$eval("input[name="+ serv +"]", (element) => {
				element.click();
				return element.checked;
			});
		}

		if(serv == "DCV"){
			await page.waitForSelector(".dicom-surcharge-input", {timeout: 10000, visible: true});
			await page.type(".dicom-surcharge-input", "10");
		}

		// push to the array
		selected.push(serv);
	}
	return selected;
}

/**
 * </Private Functions>
 */

export const PackageDetails = {
	PackageRandomizer: () => {
		return {
			type: {
				parcel: parcelPackages[Math.floor(Math.random() * parcelPackages.length)],
				freight: freightPackages[Math.floor(Math.random() * freightPackages.length)]
			},
			measurement: measurements[Math.floor(Math.random() * measurements.length)],
			quantity: Math.floor(Math.random() * 5) + 2,
			weight: Math.floor(Math.random() * 10) + 1,
			length: Math.floor(Math.random() * 15) + 5,
			width: Math.floor(Math.random() * 15) + 5,
			height: Math.floor(Math.random() * 15) + 5,
			instructions: faker.random.words(3)
		};
	}
};

export const Wizard = {
	Setup: (_page, _browser) => {
		page = _page;
		browser = _browser;

		return (page != null && browser != null);
	},
	GetCurrentPackages: () => {
		return currentpkgs;
	},
	GetRefsServices: () => {
		return refsServices;
	},
	
	GoToWizard: async() => {
		let wizard_selector = "#root > div > div.page-container > div.view-container > div > div.side-bar > div.menu-item.hover-over.shipping > span > div.sub-routes > div:nth-child(2)";
		await page.hover("#root > div > div.page-container > div.view-container > div > div.side-bar > div.menu-item.hover-over.shipping");
		await page.waitForSelector(wizard_selector, {timeout: 10000, visible: true});
		await page.click(wizard_selector);
		await page.waitForSelector(".shipping-wizzard", {timeout: 10000, visible: true});
	},
	AddressDetails: async(from, to, type, account) => {
		// Get the from contact
		await _.Wizard.GetFromContact(from);
		// Get the to contact
		await _.Wizard.GetToContact(to);
		// Chnage the payment type
		await _.changeSelect.withName("payment_type", type);
		// Change the billing account
		await _.changeSelect.withName("billing_account", account);

		currentAccount = account;
	},
	PackageDetails: async(service, packageCount) => {
		// Create the packages array to return for printing validation
		let packages = [];

		// Create packageCount number of packages
		for(let i=0; i < packageCount; i++){
			// Generate a random package
			let _package = PackageDetails.PackageRandomizer();
			// Change the type of package
			await _.changeSelect.withName("type", currentAccount != "8292093"? _package.type.parcel : _package.type.freight);
			
			// Change the quantity to the package
			//await ChangePackageQuantity(_package.quantity.toString());
			await _.changeInput.withName("quantity", _package.quantity.toString());

			// Check to see if the package is an Envelope
			if(currentAccount != "8292093" && _package.type.parcel != "EV"){
				// Measurement disabled for now
				//await ChangeMeasurement(_package.measurement);await page.waitFor(1500);
				await _.changeInput.withName("weight", _package.weight.toString());
				await _.changeInput.withName("length", _package.length.toString());
				await _.changeInput.withName("width", _package.width.toString());
				await _.changeInput.withName("height", _package.height.toString());
			}

			// Change the instructions
			await _.changeInput.withName("instructions", _package.instructions);

			// Change the service type
			await _.changeSelect.withName("service_type", service);

			// Change the pickup date
			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + 1);
			await _.changeSelect.withName("pickup_date", currentDate.toISOString().split('T')[0]);

			// Click on add package
			await page.click(".btn.btn-md.btn-secondary.inline");
			// Add package to the array
			packages.push(_package);
		}
		currentpkgs = packages;
		return packages;
	},
	CustomsDetails: async() => {
		await page.waitFor(2500);
		let details = {
			purpose: purposes[Math.floor(Math.random() * purposes.length)],
			description: faker.random.words(2),
			broker: broker,
			duty: dutyOptions[Math.floor(Math.random() * dutyOptions.length)]
		};

		await _.changeInput.withName("productName", "PS4");
		await page.waitForSelector(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a", {timeout: 10000, visible: true});
		await page.click(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a");
		
		await page.click("input[name=description]");
		await page.waitFor(2500);
		//div.form-group.std.broker-select > select
		await _.changeSelect.withName("purpose", details.duty);
		await _.changeSelect.withName("broker_id", details.duty);
		await _.changeSelect.withName("bill_to", details.duty);
		if(details.duty == "THIRD_PARTY"){
			await page.click(".dicon-book");
			await page.click("div.address-book.customs > section > div:nth-child(1) > div:nth-child(2) > div.contact-entry-note");
		}
		await _.changeInput.withName("description", details.description);

		await page.waitFor(2500);

		return details;

	},
	ConfirmAndPay: async(readyBy, closingTime, pickupPoint, account) => {
		await page.waitFor(2500);

		// Change the pickupPoint
		await _.changeSelect.withName("pickup_point", pickupPoint);
		// Change Pickup ready by
		await _.changeSelect.withName("pickup_ready_by", readyBy);
		// Change pickup closing time
		await _.changeSelect.withName("pickup_closing_time", closingTime);

		// Generate random references and save them in order to 
		// send them back for validation on printing
		let references = {
			employee: faker.random.number({min: 10000, max: 9999999}).toString(),
			invoice: "INV" + faker.random.number({min: 10000, max: 9999999}),
			order: "ORD" + faker.random.number({min: 10000, max: 9999999}),
			reference: "REF" + faker.random.number({min: 10000, max: 9999999})
		};

		// Change all references 1=EMP, 2=INV, 3=PON, 4=PRE 
		await _.changeInput.withSelector(Selectors.Wizard.inputs.employee, references.employee);
		await _.changeInput.withSelector(Selectors.Wizard.inputs.invoice, references.invoice);
		await _.changeInput.withSelector(Selectors.Wizard.inputs.purchase_order, references.order);
		await _.changeInput.withSelector(Selectors.Wizard.inputs.pre_sold_order, references.reference);

		let selected = await GenerateAdditionalServices(account);

		refsServices = {references: references, services: selected};
		return {references: references, services: selected};
	},
	RestartShipment: async () => {
		await Wizard.GoToWizard();
		await page.click(".dicon-redo");
		await page.waitForSelector(".shipping-wizzard", {timeout: 10000, visible: true});
	}
}

export const Quick = {

	// Function
	// 
	GoToQuick: async() => {
		await page.hover(".menu-item.active.hover-over.shipping");
		await page.waitForSelector(".sub-routes div:nth-child(3)");
		await page.click(".sub-routes div:nth-child(3)");
	},

	Setup: (_page, _browser) => {
		page = _page;
		browser = _browser;

		return (page != null && browser != null);
	}
}

async function WriteTitle(title, stream){
	for(var i = 0; i < 25; i++)
		stream.write("=")
	stream.write(title);
	for(var i = 0; i < 25; i++)
		stream.write("=")
	stream.write("\n");
}

export const Writer = {
	WriteDataToFile: async (full_path) => {
		let packages = currentpkgs;
		let refs = refsServices.references;
		let services = refsServices.services;
		let stream = fs.createWriteStream(full_path);

		stream.once('open', () => {
			// PACKAGES
			WriteTitle("Packages", stream);
			for(var i = 0; i < packages.length; i++){
				stream.write("Package #" + (i+1) + "\n");
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
			stream.write("\tEmployee Number: " + refs.employee + "\n");
			stream.write("\tInvoice Number: " + refs.invoice + "\n");
			stream.write("\tPurchase Order number: " + refs.order + "\n");
			stream.write("\tPre-Sold Order Reference #: " + refs.reference + "\n");
	
	
			// SERVICES
			WriteTitle("Services", stream);
			services.forEach((service) => {
				stream.write("\t" + service + "\n");
			});
		});
	},
	WritetoFile: async (path, data) => {
		let stream = fs.createWriteStream(path);
		
		stream.once('open', () => {
			stream.write(data);
		});
	}
}