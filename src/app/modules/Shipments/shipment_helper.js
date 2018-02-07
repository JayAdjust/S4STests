import { _ } from '../Start/start_controller';
import faker from 'faker';
import fs, { read } from 'fs';

// Constants
const measurements = ["metric", "imperial"];
const parcelPackages = ["EV", "BX"];
const freightPackages = ["tube","other","baril","skid","box","crate","full","bundle","piece","pallet"];
const additionalServices = ["HFP","NCV","TRD","WKD","DCV","PHS"];
const freightServices = ["Appointment","COD","Heating","Hold for pick up Saturday","Hold for pickup",
	"Inside delivery","Private house","Private house pick up","Tailgate","Tailgate pick up", "DCV"];
const purposes = ["COM","PER","DOC","RET"];
const dutyOptions = ["SHIPPER","RECIPIENT"/*,"THIRD_PARTY"*/];
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
async function changeSelect(name, value){
	let ready = false;
	while(!ready){
		await page.select("select[name="+name+"]", value);
		ready = (await page.$eval("select[name="+name+"]", (element) => {
			var selected = element.options[element.selectedIndex];
			return selected.getAttribute("value");
		})) == value;
	}
}
async function changeInput(name, value){
	let ready = false;
	while(!ready){
		await page.click("input[name="+name+"]");
		await page.$eval("input[name="+name+"]",(element) => {
    	    element.value = "";
		});
		await page.type("input[name="+name+"]",value);

		ready = (await page.$eval("input[name="+name+"]",(element) => {
			return element.value;
		})) == value;
	}
}
async function changeReference(number, value){
	// Number: 1=EMP, 2=INV, 3=PON, 4=PRE 
	let ready = false;
	while(!ready){
		await page.click(".kv-inputs div:nth-child("+ number +") input:nth-child(2)");
		await page.$eval(".kv-inputs div:nth-child("+ number +") input:nth-child(2)", (element) => {
			element.value = "";
		});

		await page.type('.kv-inputs div:nth-child('+ number +') input:nth-child(2)', value);
		ready = (await page.$eval(".kv-inputs div:nth-child("+ number +") input:nth-child(2)", (element) => {
			return element.value;
		})) == value;
	}
}
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
	Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();

		return page != null && browser != null;
	},
	GetCurrentPackages: () => {
		return currentpkgs;
	},
	GetRefsServices: () => {
		return refsServices;
	},

	GoToWizard: async() => {
		await page.hover(".menu-item.active.hover-over.shipping");
		await page.waitForSelector(".sub-routes div:nth-child(2)", {timeout: 10000, visible: true});
		await page.click(".sub-routes div:nth-child(2)");
		await page.waitForSelector(".shipping-wizzard", {timeout: 10000, visible: true});
	},
	AddressDetails: async(from, to, type, account) => {
		// Get the from contact
		await GetFromContact(from);
		// Get the to contact
		await GetToContact(to);
		// Chnage the payment type
		await changeSelect("payment_type", type);
		// Change the billing account
		await changeSelect("billing_account", account)
		
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
			await changeSelect("type", currentAccount != "8292093"? _package.type.parcel : _package.type.freight);
			// Change the quantity to the package
			//await ChangePackageQuantity(_package.quantity.toString());
			await changeInput("quantity", _package.quantity.toString());

			// Check to see if the package is an Envelope
			if(currentAccount != "8292093" && _package.type.parcel != "EV"){
				// Measurement disabled for now
				//await ChangeMeasurement(_package.measurement);await page.waitFor(1500);
				await changeInput("weight", _package.weight.toString());
				await changeInput("length", _package.length.toString());
				await changeInput("width", _package.width.toString());
				await changeInput("height", _package.height.toString());
			}

			// Change the instructions
			await changeInput("instructions", _package.instructions);

			// Change the service type
			await changeSelect("service_type", service);

			// Change the pickup date
			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + 1);
			await changeSelect("pickup_date", currentDate.toISOString().split('T')[0]);

			// Click on add package
			await page.click(".btn.btn-md.btn-secondary.inline");
			// Add package to the array
			packages.push(_package);
		}
		currentpkgs = packages;
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
		await page.type("input[name=productName]", "ps4");
		await page.waitForSelector(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a", {timeout: 10000, visible: true});
		await page.click(".dropdown-menu.bootstrap-typeahead-menu.dropdown-menu-justify a");

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
	ConfirmAndPay: async(readyBy, closingTime, pickupPoint, account) => {
		await page.waitFor(2500);

		// Change the pickupPoint
		await changeSelect("pickup_point", pickupPoint);
		// Change Pickup ready by
		await changeSelect("pickup_ready_by", readyBy);
		// Change pickup closing time
		await changeSelect("pickup_closing_time", closingTime);

		// Generate random references and save them in order to 
		// send them back for validation on printing
		let references = {
			employee: faker.random.number({min: 10000, max: 9999999}).toString(),
			invoice: "INV" + faker.random.number({min: 10000, max: 9999999}),
			order: "ORD" + faker.random.number({min: 10000, max: 9999999}),
			reference: "REF" + faker.random.number({min: 10000, max: 9999999})
		};

		console.log(references);
		// Change all references 1=EMP, 2=INV, 3=PON, 4=PRE 
		await changeReference(1,references.employee);
		await changeReference(2,references.invoice);
		await changeReference(3,references.order);
		await changeReference(4,references.reference);

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

	Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
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
				stream.write("Package #" + i + "\n");
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
	}
}