import fs from 'fs';
import Helper from './helper';
import { ACCOUNTS } from '../Shipments/shipment_details';

export async function WriteDataToFile(full_path, currentpkgs, refsServices, currentAccount){
    let packages = currentpkgs;
    let refs = refsServices.references;
    let services = refsServices.services;
    let stream = fs.createWriteStream(full_path);

    stream.once('open', () => {
        // PACKAGES
        Helper.WriteTitle("Packages", stream);
        for(var i = 0; i < packages.length; i++){
            stream.write("Package #" + (i+1) + "\n");
            stream.write("\tType: " + currentAccount != ACCOUNTS.ca_freight? packages[i].type.parcel : packages[i].type.freight + "\n");
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
        Helper.WriteTitle("References", stream);
        stream.write("\tEmployee Number: " + refs.employee + "\n");
        stream.write("\tInvoice Number: " + refs.invoice + "\n");
        stream.write("\tPurchase Order number: " + refs.order + "\n");
        stream.write("\tPre-Sold Order Reference #: " + refs.reference + "\n");


        // SERVICES
        Helper.WriteTitle("Services", stream);
        services.forEach((service) => {
            stream.write("\t" + service + "\n");
        });
    });
}
	
export async function WritetoFile(path, data){
    let stream = fs.createWriteStream(path);
    
    stream.once('open', () => {
        stream.write(data);
    });
}