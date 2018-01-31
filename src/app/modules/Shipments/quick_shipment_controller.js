import { _ } from '../StartUp/startUp_controller';
import { Log } from '../Logging/logging';
import { Quick } from './shipment_helper';

let page;
let browser;

async function CreateDomesticShipment(from, to, type, account){
    await Quick.GoToQuick();
}

async function CreateXBorderShipment(from, to){
    await Quick.GoToQuick();
}

export const Run = async() => {
    page = _.GetPage();
    browser = _.GetBrowser();
    
    await Quick.SetupPageAndBrowser(page, browser);
    await CreateDomesticShipment("", "");

    //!XBorder? await CreateDomesticShipment() : await CreateXBorderShipment();
}