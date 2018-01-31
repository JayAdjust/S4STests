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
        // click the "create contact" button
        await page.click(".dicon-add-new");

        // enter the customer ID
        if (customerID !== "") {
            await page.focus("input[name=customer_id]");
            await page.type("input[name=customer_id]", customerID);
        }

        // enter the customer's billing account
        if (billingAccount !== "") {
            await page.focus("input[name=billing_account]");
            await page.type("input[name=billing_account]", customerID);
        }

        // enter the customer's billing account
        await page.focus("input[name=company_name]");
        await page.type("input[name=company_name]", company);

        // enter the city
        await page.focus("select[name='country']");
        await page.select("select[name='country']", country);

        // enter the postal code / zip code
        await page.focus("input[name=postal_code]");
        await page.type("input[name=postal_code]", postalCode);

        // enter street address
        await page.type(".address-field.form-group.std input", address)

        return true;
    }
}