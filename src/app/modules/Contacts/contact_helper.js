import { _ } from '../Start/start_controller';

let page;
let browser;

export const Contact = {
    Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
    },
    
    GoToContacts: async () => {
        // hover over the "Manage" section in the sidebar
        await page.hover(".menu-item.hover-over.manage");
        await page.waitFor(500);

        // click the 1st item that appears (Contacts)
        await page.click(".sub-route div:nth-child(1)");
        await page.waitFor(300);

        return !!(await page.$(".manage-contacts-header"));
    },

    onCreateContact: async (customerID, billingAccount, company, country, postalCode, address, addressLine2, city, province, attentionTo, phone, phoneExt, email, mobilePhone, wantsSameCompanyName) => {
        // click the "+ create contact" button
        await page.click(".dicon-add-new");
        await page.waitFor(20);

        // clear all the textboxes
        await ClearAllTextBoxes();

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
        await page.waitFor(100);

        // TODO: too buggy
        if (!wantsSameCompanyName) {
            var num = 0;
            var autoCompleteCompanyExists = !!(await page.$(".company-address-list div:nth-child(1)"));
            while (autoCompleteCompanyExists) {
                num++;
                await page.focus("input[name=company_name]");
                await page.waitFor(20);

                await page.evaluate(function() {
                    document.querySelector('input[name=company_name]').value = "";
                });
                await page.waitFor(1000);

                await page.type("input[name=company_name]", company + " (" + num + ")");
                await page.waitFor(1000);

                var autoCompleteCompanyExists = !!(await page.$(".company-address-list div:nth-child(1)"));
            }
        }

        // remove the autocomplete window when entering a company name
        // simply focus on something else will remove it
        // can cause bugs otherwise
        await page.focus("input[name=customer_id]");
        await page.waitFor(200);

        // enter the country
        await page.focus("select[name='country']");
        await page.waitFor(20);
        await page.select("select[name='country']", country);

        // enter the postal code / zip code
        await page.focus("input[name=postal_code]");
        await page.waitFor(500); // postal code/zip code needs more of a delay, bugs can/will occur otherwise
        await page.focus("input[name=postal_code]"); // needed again for some reason
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
            } else {
                // when the auto complete window didn't show up, type in the city manually
                await page.focus("input[name=city]");
                await page.waitFor(20);
                await page.type("input[name=city]", city);

                // removed - enter a valid postal code and it fills this in for you
                //await page.focus("input[name=state]");
                //await page.waitFor(20);
                //await page.type("input[name=state]", province);
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
            await page.click(".btn.btn-md.btn-secondary.inline.floating");
            await page.waitFor(100);

            // if an error occured and was caught on the clientside, a red box appears around the textbox
            var textboxErrorExists = !!(await page.$(".help-block"));
            return !textboxErrorExists;
        }
    }
}

async function ClearAllTextBoxes() {
    await page.evaluate(function() {
        document.querySelector('input[name=customer_id]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=billing_account]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=company_name]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=postal_code]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('.address-field.form-group.std input').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=street_line_2]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=city]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=state]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=person_full_name]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=phone]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=phone_ext]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=email]').value = "";
    });

    await page.evaluate(function() {
        document.querySelector('input[name=mobile_phone]').value = "";
    });
}