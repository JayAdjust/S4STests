import { _ } from '../Start/controller';
import faker from 'faker';

/**
 * changeInput and changeSelect are used in this and shipment_helper,
 * and will possibly be used in others. Maybe create a seperate file for 
 * all change input, select, etc. functions that can be used.
 * 
 * Idea:    create one that only takes name like shipment_helper
 *          create one that takes in the selector like this
 * 
 */
async function changeInput(name, value, match = null){
    match = match == null? value : match;
    let ready = false;
	while(!ready){
		await page.click(name);
		await page.$eval(name,(element) => {
    	    element.value = "";
		});
		await page.type(name,value);

		ready = (await page.$eval(name,(element) => {
			return element.value;
		})) == match;
	}
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
// FROM: https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
function formatPhoneNumber(s) {
    var s2 = (""+s).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
  }

let page;
let browser;

export const Contact = {
    Setup: () => {
		page = _.GetPage();
        browser = _.GetBrowser();
        
        return page != null && browser != null;
    },
    GoToContacts: async () => {
        await page.hover(".menu-item.hover-over.manage");
        await page.waitForSelector(".sub-route div:nth-child(1)", {timeout: 10000, visible: true});
        await page.click(".sub-route div:nth-child(1)");
        await page.waitForSelector(".manage-contacts-header", {timeout: 10000, visible: true});
        return !!(await page.$(".manage-contacts-header"));
    },
    onCreateContact: async (customerID, billingAccount, company, country, postalCode, address, addressLine2, city, province, attentionTo, phone, phoneExt, email, mobilePhone, wantsSameCompanyName) => {
        // click the "+ create contact" button
        await page.click(".dicon-add-new");
        await page.waitFor(2000);

        // enter the customer ID
        await changeInput("input[name=customer_id]", customerID);
        // enter the customer's billing account

        await changeInput("input[name=billing_account]", billingAccount);

        // enter the company name
        await changeInput("input[name=company_name]", faker.company.companyName());

        // enter the country
        await changeSelect("country", country);

        // enter the postal code / zip code
        var match = postalCode.length == 6? postalCode.replace(/\W/g,'').replace(/(...)/,'$1 ') : null;
        await changeInput("input[name=postal_code]", postalCode, match);
        
        // enter main street address
        var exists = !!(await page.$("div.address-field.form-group.std.has-error > input"));
        exists? await changeInput("div.address-field.form-group.std.has-error > input", address) : 
                await changeInput("div.address-field.form-group.std > input", address);

        // wait for the auto-complete window to show
        // assume that if no popup window shows after 3 seconds, it's an invalid address
        // after the timeout exceeded, puppeteer will throw an error, so it is needed in a try catch
        try {
            await page.waitFor(".auto-address-item div:nth-child(1)", {timeout: 3000});
        } catch (e) {
            // the timeout was exceeded, no popup window here
        } finally {
            // this code runs whether the autocomplete showed or not
            // determine if it did show up...
            var autoCompleteWidnowExists = !!(await page.$(".auto-address-item div:nth-child(1)"));

            if (autoCompleteWidnowExists) {
                await page.click(".auto-address-item div:nth-child(1)");
            } else {
                // when the auto complete window didn't show up, type in the city manually
                await changeInput("input[name=city]", city);
            }

            // enter street address line #2
            await changeInput("input[name=street_line_2]", addressLine2);

            // enter "Attention To"
            await changeInput("input[name=person_full_name]", attentionTo);

            // enter phone
            await changeInput("input[name=phone]", phone, formatPhoneNumber(phone));

            // enter phone extension
            await changeInput("input[name=phone_ext]", phoneExt);

            // enter email
            await changeInput("input[name=email]", email);

            // enter mobile phone
            await changeInput("input[name=mobile_phone]", mobilePhone, formatPhoneNumber(mobilePhone));

            // click the "Add Contact" button
            await page.waitFor(100);
            await page.click(".btn.btn-md.btn-secondary.inline.floating");
            await page.waitFor(100);

            // if an error occured and was caught on the clientside, a red box appears around the textbox
            var textboxErrorExists = !!(await page.$(".help-block"));
            return !textboxErrorExists;
        }
    }
}