import { _ } from '../Start/controller';
import faker from "faker";
import { Contact } from './helper';
import { Selectors } from './selectors';

let page;
let browser;

/**
 * Tests for Jest
 */ 
export const Tests = {
    Setup: () => {
        page = _.GetPage();
        browser = _.GetBrowser();
        return Contact.Setup() && page != null && browser != null;
    },
    GoToContacts: async () => {
        return await Contact.GoToContacts();
    },
    T1: async () => {
        return await Contact.onCreateContact("", "", "Jared", "CA", "H9K1M2", "1234 BAD ADDRESS", "", "Montreal", "Quebec", "Some Contact", "5141111111", "", "", "", false);
    },
    T2: async () => {
        return await Contact.onCreateContact("", "", "Jaredddddddddddd", "CA", "H9K1M2", "", "", "Montreal", "Quebec", "Some Contact", "5141111111", "", "", "", false);
    },
    T3: async () => {
        return await Contact.onCreateContact("", "", "", "CA", "H9K1M2", "17960 Rue Foster", "", "Montreal", "Quebec", "Some Contact", "5141111111", "", "", "", false);
    }
}

async function getFromInput(selector){
	return await page.$eval(selector,(element) => {
			return element.value;
	});
}
async function getFromSelect(selector){
    return await page.$eval(selector, (element) => {
        var selected = element.options[element.selectedIndex];
        return selected.getAttribute("value");
    });
}
export const ContactList = {
    GetContactList: async () => {
        expect(await Contact.GoToContacts()).toBe(true);
        let select = Selectors.selects.steps;
        let list = Selectors.sections.contact_list;
        await page.waitFor(500);
        await page.select(select, "3000");
        await page.waitFor(500);

        let numSections = await page.$eval(list, (element) => {
            return element.childElementCount;
        });
        let contacts = [];

        // TODO: ADD A FAILSAFE, ex if numSections * x {where x is average items/section} > y, set a limit on numItems

        for(let i = 0; i < numSections - 1; i++){
            let section = "section.contact-entry-list > div:nth-child("+(i+1)+")";
            let numItems = await page.$eval(section, (element) => {
                return element.childElementCount;
            });

            for(let j = 0; j < numItems - 1; j++){
                let item = "section.contact-entry-list > div:nth-child("+(i+1)+") > div:nth-child("+ (j + 2) +")";

                await page.click(item);
                await page.waitFor(50);
                await page.click(Selectors.buttons.edit);
                await page.waitFor(50);

                contacts.push({
                    customer_id: await getFromInput(Selectors.inputs.customer_id),
                    billing_account: await getFromInput(Selectors.inputs.billing_account),
                    company: await getFromInput(Selectors.inputs.company),
                    country: await getFromSelect(Selectors.selects.country),
                    postal_code: await getFromInput(Selectors.inputs.postal_code),
                    address: await getFromInput(Selectors.inputs.address),
                    address_2: await getFromInput(Selectors.inputs.address_2),
                    city: await getFromInput(Selectors.inputs.city),
                    province: await getFromInput(Selectors.inputs.province),
                    attention_to: await getFromInput(Selectors.inputs.attention_to),
                    phone: await getFromInput(Selectors.inputs.phone),
                    phone_ext: await getFromInput(Selectors.inputs.phone_ext),
                    email: await getFromInput(Selectors.inputs.email),
                    mobile_phone: await getFromInput(Selectors.inputs.mobile_phone)
                });

                await page.click(Selectors.spans.close);
            }
        }
        return contacts;
    }
}