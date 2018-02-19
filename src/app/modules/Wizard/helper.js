import faker from 'faker';
import fs, { read } from 'fs';
import * as _ from '../Puppeteer/page_helper';
import { Selectors } from './selectors';
import * as details from '../Shipments/shipment_details';

// Constants
const broker = "cisuu7xyi000o0yghovn49w6u";

// FIELDS
let page;
let browser;
let currentpkgs;
let refsServices;
let currentAccount;

export const PackageDetails = {
	PackageRandomizer: () => {
		return {
			type: {
				parcel: details.PARCEL_PACKAGES.array[Math.floor(Math.random() * details.PARCEL_PACKAGES.array.length)],
				freight: details.FREIGHT_PACKAGES.array[Math.floor(Math.random() * details.FREIGHT_PACKAGES.array.length)]
			},
			measurement: details.MEASUREMENTS.array[Math.floor(Math.random() * details.MEASUREMENTS.array.length)],
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
		await page.hover(Selectors.divs.shipping_sidebar);
		await page.waitForSelector(Selectors.divs.wizard_selector, {timeout: 10000, visible: true});
		await page.click(Selectors.divs.wizard_selector);
		await page.waitForSelector(Selectors.divs.wizard_container, {timeout: 10000, visible: true});
	},
	AddressDetails: async(from, to, type, account) => {
		await _.Wizard.GetFromContact(from);
		await _.Wizard.GetToContact(to);
		await _.changeSelect.withName(Selectors.byName.payment_type, type);
		await _.changeSelect.withName(Selectors.byName.billing_account, account);

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
			await _.changeSelect.withName(Selectors.byName.package_type, currentAccount != details.ACCOUNTS.ca_freight? _package.type.parcel : _package.type.freight);
			
			// Change the quantity to the package
			//await ChangePackageQuantity(_package.quantity.toString());
			await _.changeInput.withName(Selectors.byName.package_quantity, _package.quantity.toString());

			// Check to see if the package is an Envelope
			if(currentAccount != details.ACCOUNTS.ca_freight && _package.type.parcel != details.PARCEL_PACKAGES.envelope){
				await _.Wizard.ChangeMeasurement(_package.measurement);
				await _.changeInput.withName(Selectors.byName.package_weight, _package.weight.toString());
				await _.changeInput.withName(Selectors.byName.package_length, _package.length.toString());
				await _.changeInput.withName(Selectors.byName.package_width, _package.width.toString());
				await _.changeInput.withName(Selectors.byName.package_height, _package.height.toString());
			}

			// Change the instructions & service_type
			await _.changeInput.withName(Selectors.byName.instructions, _package.instructions);
			await _.changeSelect.withName(Selectors.byName.service_type, service);

			// Change the pickup date
			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + 1);
			await _.changeSelect.withName(Selectors.byName.date, currentDate.toISOString().split('T')[0]);

			// Click on add package
			await page.click(Selectors.buttons.add_package);
			// Add package to the array
			packages.push(_package);
		}
		currentpkgs = packages;
		return packages;
	},
	CustomsDetails: async() => {
		await page.waitFor(2500);
		let custom_details = {
			purpose: details.PURPOSES.array[Math.floor(Math.random() * details.PURPOSES.array.length)],
			description: faker.random.words(2),
			broker: broker,
			duty: details.DUTY_OPTIONS.array[Math.floor(Math.random() * details.DUTY_OPTIONS.array.length)]
		};

		await _.changeInput.withName("productName", "PS4");
		await page.waitForSelector(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a", {timeout: 10000, visible: true});
		await page.click(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a");
		
		await page.click("input[name=description]");
		await page.waitFor(2500);
		//div.form-group.std.broker-select > select
		await _.changeSelect.withName("purpose", custom_details.duty);
		await _.changeSelect.withName("broker_id", custom_details.duty);
		await _.changeSelect.withName("bill_to", custom_details.duty);
		if(custom_details.duty == "THIRD_PARTY"){
			await page.click(".dicon-book");
			await page.click("div.address-book.customs > section > div:nth-child(1) > div:nth-child(2) > div.contact-entry-note");
		}
		await _.changeInput.withName("description", custom_details.description);

		await page.waitFor(2500);

		return custom_details;

	},
	ConfirmAndPay: async(readyBy, closingTime, pickupPoint, account) => {
		await page.waitFor(2500);

		// Change the pickupPoint
		await _.changeSelect.withName(Selectors.byName.point, pickupPoint);
		// Change Pickup ready by
		await _.changeSelect.withName(Selectors.byName.ready_by, readyBy);
		// Change pickup closing time
		await _.changeSelect.withName(Selectors.byName.closing_time, closingTime);

		// Generate random references and save them in order to 
		// send them back for validation on printing
		let references = {
			employee: faker.random.number({min: 10000, max: 9999999}).toString(),
			invoice: "INV" + faker.random.number({min: 10000, max: 9999999}),
			order: "ORD" + faker.random.number({min: 10000, max: 9999999}),
			reference: "REF" + faker.random.number({min: 10000, max: 9999999})
		};

		// Change all references 1=EMP, 2=INV, 3=PON, 4=PRE 
		await _.changeInput.withSelector(Selectors.inputs.employee, references.employee);
		await _.changeInput.withSelector(Selectors.inputs.invoice, references.invoice);
		await _.changeInput.withSelector(Selectors.inputs.purchase_order, references.order);
		await _.changeInput.withSelector(Selectors.inputs.pre_sold_order, references.reference);

		//let selected = await GenerateAdditionalServices(account);
		let selected = await _.Wizard.GenerateAdditionalServices(account);
		refsServices = {references: references, services: selected};
		return {references: references, services: selected};
	},
	RestartShipment: async () => {
		await Wizard.GoToWizard();
		await page.click(Selectors.buttons.restart_shipment);
		await page.waitForSelector(Selectors.divs.wizard_container, {timeout: 10000, visible: true});
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
				stream.write("\tType: " + currentAccount != "8292093"? packages[i].type.parcel : packages[i].type.freight + "\n");
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