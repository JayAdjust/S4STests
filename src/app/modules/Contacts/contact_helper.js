import { _ } from '../Start/start_controller';

let page;
let browser;

export const Contact = {
    Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
    },
    
    GoToContacts: async () => {
        //await page.waitFor(1000);
        await page.hover(".menu-item.hover-over.manage");
        //await page.waitFor(500);
        await page.click(".sub-route div:nth-child(1)");
        //await page.waitFor(1000);

        return !!(await page.$(".manage-contacts-header"));
    },

    onCreateContact: async (customerID, billingAccount, company, country, postalCode, address, addressLine2, city, province, attentionTo, phone, phoneExt, email, mobilePhone) => {
        // click the "+ create contact" button
        await page.click(".dicon-add-new");

        // enter the customer ID
        if (customerID !== "") {
            await page.focus("input[name=customer_id]");
            await page.waitFor(20);
            await page.type("input[name=customer_id]", customerID);
        }

        // enter the customer's billing account
        if (billingAccount !== "") {
            await page.focus("input[name=billing_account]");
            await page.waitFor(20);
            await page.type("input[name=billing_account]", customerID);
        }

        // enter the company name
        await page.focus("input[name=company_name]");
        await page.waitFor(20);
        await page.type("input[name=company_name]", company);

        // remove the autocomplete window when entering a company name
        // simply focus on something else will remove it
        // can cause bugs otherwise
        await page.focus("input[name=customer_id]");

        // enter the country
        await page.focus("select[name='country']");
        await page.waitFor(20);
        await page.select("select[name='country']", country);

        // enter the postal code / zip code
        await page.focus("input[name=postal_code]");
        await page.waitFor(20);
        await page.type("input[name=postal_code]", postalCode);

        // enter main street address
        await page.focus(".address-field.form-group.std input");
        await page.waitFor(20);
        await page.type(".address-field.form-group.std input", address);

        // wait for the auto-complete window to show
        // assume that if no popup window shows after 5 seconds, it's an invalid address
        // after the timeout exceeded, puppeteer will throw an error, so it is needed in a try catch
        try {
            await page.waitFor(".auto-address-item div:nth-child(1)", {timeout: 5000});
        } catch (e) {
            // the timeout was exceeded
        } finally {
            // this code runs whether the autocomplete showed or not
            // determine if it did show up...
            var autoCompleteWidnowExists = !!(await page.$(".auto-address-item div:nth-child(1)"));

            if (autoCompleteWidnowExists) {
                await page.click(".auto-address-item div:nth-child(1)");
                console.log("AUTOCOMPLETE ADDRESS SHOW!!!");
            }

            // enter street address line #2
            if (addressLine2 !== "") {
                await page.focus("input[name=street_line_2]");
                await page.waitFor(20);
                await page.type("input[name=street_line_2]", addressLine2);
            }

            // enter "Attention To"
            await page.focus("input[name=person_full_name]");
            await page.waitFor(20);
            await page.type("input[name=person_full_name]", attentionTo);

            // enter phone
            if (phone !== "") {
                await page.focus("input[name=phone]");
                await page.waitFor(20);
                await page.type("input[name=phone]", phone);
            }

            // enter phone extension
            if (phoneExt !== "") {
                await page.focus("input[name=phone_ext]");
                await page.waitFor(20);
                await page.type("input[name=phone_ext]", phoneExt);
            }

            // enter email
            if (email !== "") {
                await page.focus("input[name=email]");
                await page.waitFor(20);
                await page.type("input[name=email]", email);
            }

            // enter mobile phone
            if (mobilePhone !== "") {
                await page.focus("input[name=mobile_phone]");
                await page.waitFor(20);
                await page.type("input[name=mobile_phone]", mobilePhone);
            }

            //await page.waitFor(2000);

            // click the "Add Contact" button
            //await page.click("btn btn-md.btn-secondary.inline.floating");

            await page.waitFor(4000);
    
            return true;
        }
    }
}