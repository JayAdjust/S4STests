import * as Contact_Selectors from '../Contacts/selectors';
import * as Wizard_Selectors from '../Wizard/selectors';

const Selectors = {
    Wizard: Wizard_Selectors.Selectors,
    Contact: Contact_Selectors.Selectors,
}

const additionalServices = ["HFP","NCV","TRD","WKD","DCV","PHS"];
const freightServices = ["Appointment","COD","Heating","Hold for pick up Saturday","Hold for pickup", "Inside delivery",
                            "Private house","Private house pick up","Tailgate","Tailgate pick up", "DCV"];
let page, browser;

export function Setup(_page, _browser){
    page = _page;
    browser = _browser;

    return (page != null && browser != null);
}

// General Functions
export const changeSelect = {
    withName: async (name, value, match = null) => {
        // Can't do: changeSelect.withSelector("select[name="+name+"]", value ,match);
        match = match == null? value : match;
        let ready = false;
        while(!ready){
            await page.select("select[name="+name+"]", value);
            ready = (await page.$eval("select[name="+name+"]", (element) => {
                var selected = element.options[element.selectedIndex];
                return selected.getAttribute("value");
            })) == value;
        }
    },
    withSelector: async (selector, value, match = null) => {
        match = match == null? value : match;
        let ready = false;
        while(!ready){
            await page.select(selector, value);
            ready = (await page.$eval(selector, (element) => {
                var selected = element.options[element.selectedIndex];
                return selected.getAttribute("value");
            })) == match;
        }
    },
}
export const changeInput = {
    withName: async (name, value, match = null) => {
        // Can't do: await changeInput.withSelector("input[name="+name+"]", value ,match);
        match = match == null? value : match;
        let ready = false;
        while(!ready){
            await page.click("input[name="+name+"]");
            await page.$eval("input[name="+name+"]",(element) => {
                element.value = "";
            });
            await page.type("input[name="+name+"]",value);
    
            ready = (await page.$eval("input[name="+name+"]",(element) => {
                return element.value;
            })) == match;
        }
    },
    withSelector: async (selector, value, match = null) => {
        match = match == null? value : match;
        let ready = false;
        while(!ready){
            await page.click(selector);
            await page.$eval(selector,(element) => {
                element.value = "";
            });
            await page.type(selector,value);
    
            ready = (await page.$eval(selector,(element) => {
                return element.value;
            })) == match;
        }
    },
}

// Specific Module functions
export const Wizard = {
    GetFromContact: async (from) => {
        await page.waitFor(100);
        await page.click(Selectors.Wizard.inputs.from_contact);
        await page.type(Selectors.Wizard.inputs.from_contact, from);
        await page.waitForSelector(Selectors.Wizard.divs.contact, {timeout: 10000, visible: true});
        await page.click(Selectors.Wizard.divs.contact);
        await page.waitForSelector(Selectors.Wizard.divs.from_selected, {timeout: 10000, visible: true});
    },
    GetToContact: async (to) => {
        await page.waitFor(100);
        await page.click(Selectors.Wizard.inputs.to_contact);
        await page.type(Selectors.Wizard.inputs.to_contact, to);
        await page.waitForSelector(Selectors.Wizard.divs.contact, {timeout: 10000, visible: true});
        await page.click(Selectors.Wizard.divs.contact);
        await page.waitForSelector(Selectors.Wizard.divs.to_selected, {timeout: 10000, visible: true});
    },
    ChangeMeasurement: async (measurement) => {
        let ready = false;
        while(!ready){
            if(measurement == "metric"){
                await page.click(Selectors.Wizard.spans.metric);
                ready = await page.$eval(Selectors.Wizard.spans.metric, (element) => {
                    return element.className;
                }) == "selected";
            }else{
                await page.click(Selectors.Wizard.spans.imperial);
                ready = await page.$eval(Selectors.Wizard.spans.imperial, (element) => {
                    return element.className;
                }) == "selected";
            }
        }
    },
    GenerateAdditionalServices: async (account) => {
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
    
            // Add the addtional service if passed everything else
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
}