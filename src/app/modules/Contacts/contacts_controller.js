import { _ } from '../Start/start_controller';
import faker from "faker";
import { Contact } from './contact_helper';

const edit = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail > div > div.actions.edit-actions > button";
const close = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > span > i";
const customer_id = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(1) > div:nth-child(1) > input";
const billing_account = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(1) > div:nth-child(2) > input";
const company = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div.company-field.form-group.std > input";
const country = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(3) > div:nth-child(1) > select";
const postal_code = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(3) > div:nth-child(2) > input";
const address = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(4) > div.address-field.form-group.std > input";
const address_2 = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(4) > div.form-group.std.undefined > input";
const city = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div.control-group.split.province-wrapper > div.form-group.std.undefined > input";
const province = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div.control-group.split.province-wrapper > div:nth-child(2) > div > div > input.form-control.bootstrap-typeahead-input-main.has-selection";
const attention_to = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(6) > div > input";
const phone = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(7) > div:nth-child(1) > input";
const phone_ext = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(7) > div:nth-child(2) > input";
const email = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(8) > div:nth-child(1) > input";
const mobile_phone = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(8) > div:nth-child(2) > input";


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
        let select = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.page-footer > div.page-status > div.form-group.std.page-step > select";
        let list = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-list";
        await page.waitFor(500);
        await page.select(select, "3000");
        await page.waitFor(500);

        let numSections = await page.$eval(list, (element) => {
            return element.childElementCount;
        });
        let contacts = [];

        // TODO: ADD A FAILSAFE, ex if numSections * x {where x is average items/section} > y, set a limit on numItems

        for(let i = 0; i < numSections - 1; i++){
            let section = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-list > div:nth-child("+(i+1)+")";
            let numItems = await page.$eval(section, (element) => {
                return element.childElementCount;
            });

            for(let j = 0; j < numItems - 1; j++){
                let item = "#root > div > div.page-container > div.view-container > div > div.main_app-layout > div > div.general-layout > div.container > section > section.contact-entry-list > div:nth-child("+(i+1)+") > div:nth-child("+ (j + 2) +")";

                await page.click(item);
                await page.waitFor(50);
                await page.click(edit);
                await page.waitFor(50);

                contacts.push({
                    customer_id: await getFromInput(customer_id),
                    billing_account: await getFromInput(billing_account),
                    company: await getFromInput(company),
                    country: await getFromSelect(country),
                    postal_code: await getFromInput(postal_code),
                    address: await getFromInput(address),
                    address_2: await getFromInput(address_2),
                    city: await getFromInput(city),
                    province: await getFromInput(province),
                    attention_to: await getFromInput(attention_to),
                    phone: await getFromInput(phone),
                    phone_ext: await getFromInput(phone_ext),
                    email: await getFromInput(email),
                    mobile_phone: await getFromInput(mobile_phone)
                });

                await page.click(close);
            }
        }
        return contacts;
    }
}