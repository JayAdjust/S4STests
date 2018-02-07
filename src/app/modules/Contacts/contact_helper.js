import { _ } from '../Start/start_controller';

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
        await ClearInputBox("input[name=customer_id]");
        if (customerID !== "") {
            await page.focus("input[name=customer_id]");
            await page.waitFor(5);
            await page.type("input[name=customer_id]", customerID, { delay: 50 });
        }

        // enter the customer's billing account
        await ClearInputBox("input[name=billing_account]");
        if (billingAccount !== "") {
            await page.focus("input[name=billing_account]");
            await page.waitFor(5);
            await page.type("input[name=billing_account]", customerID);
        }

        // enter the company name
        await ClearInputBox("input[name=company_name]");
        await page.focus("input[name=company_name]");
        await page.waitFor(5);
        await page.type("input[name=company_name]", company);

        /* IDK?
        if (!wantsSameCompanyName) {
            var num = 0;
            do {
                await page.focus("input[name=company_name]");
                await page.waitFor(20);

                await page.evaluate(function() {
                    document.querySelector('input[name=company_name]').value = "";
                });
                await page.focus("input[name=customer_id]");
                await page.waitFor(100);

                if (num === 0) {
                    await page.type("input[name=company_name]", company);
                } else {
                    await page.type("input[name=company_name]", company + " (" + num + ")");
                }
                await page.waitFor(1500);

                var autoCompleteCompanyExists = !!(await page.$(".company-address-list div:nth-child(1)"));
                num++;
            } while (autoCompleteCompanyExists)
        } else {
            // just enter the company name regularly
            await page.focus("input[name=company_name]");
            await page.waitFor(20);
            await page.type("input[name=company_name]", company);
            await page.waitFor(100);
        }
        */

        // remove the autocomplete window when entering a company name
        // simply focus on something else will remove it
        // can cause bugs otherwise
        // removed
        //await page.waitFor(100);
        //await page.focus("input[name=customer_id]");
        //await page.waitFor(100);

        // enter the country
        await ClearInputBox("select[name=country]");
        await page.focus("select[name=country]");
        await page.waitFor(5);
        await page.select("select[name=country]", country);

        // enter the postal code / zip code
        await ClearInputBox("input[name=postal_code]");
        await page.focus("input[name=postal_code]");
        await page.waitFor(300); // postal code/zip code needs more of a delay, bugs can/will occur otherwise
        await page.focus("input[name=postal_code]"); // needed again for some reason
        await page.type("input[name=postal_code]", postalCode);

        // enter main street address
        await ClearInputBox(".address-field.form-group.std input");
        await page.focus(".address-field.form-group.std input");
        await page.waitFor(5);
        await page.type(".address-field.form-group.std input", address);

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
                await ClearInputBox("input[name=city]");
                await page.focus("input[name=city]");
                await page.waitFor(20);
                await page.type("input[name=city]", city);

                // removed - enter a valid postal code and it fills this in for you
                //await page.focus("input[name=state]");
                //await page.waitFor(20);
                //await page.type("input[name=state]", province);
            }

            // enter street address line #2
            await ClearInputBox("input[name=street_line_2]");
            if (addressLine2 !== "") {
                await page.focus("input[name=street_line_2]");
                await page.waitFor(5);
                await page.type("input[name=street_line_2]", addressLine2);
            }

            // enter "Attention To"
            await page.waitFor(2000);
            await page.focus("input[name=person_full_name]");
            await ClearInputBox("input[name=person_full_name]");
            await page.waitFor(2000);
            //await page.focus("input[name=person_full_name]");
            await page.waitFor(5);
            await page.type("input[name=person_full_name]", attentionTo);

            // enter phone
            await ClearInputBox("input[name=phone]");
            if (phone !== "") {
                await page.focus("input[name=phone]");
                await page.waitFor(5);
                await page.type("input[name=phone]", phone);
            }

            // enter phone extension
            await ClearInputBox("input[name=phone_ext]");
            if (phoneExt !== "") {
                await page.focus("input[name=phone_ext]");
                await page.waitFor(5);
                await page.type("input[name=phone_ext]", phoneExt);
            }

            // enter email
            await ClearInputBox("input[name=email]");
            if (email !== "") {
                await page.focus("input[name=email]");
                await page.waitFor(5);
                await page.type("input[name=email]", email);
            }

            // enter mobile phone
            await ClearInputBox("input[name=mobile_phone]");
            if (mobilePhone !== "") {
                await page.focus("input[name=mobile_phone]");
                await page.waitFor(5);
                await page.type("input[name=mobile_phone]", mobilePhone);
            }

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

async function ClearInputBox(e) {
    await page.evaluate(function(e) {
        document.querySelector(e).value = "";
    }, e);
}

async function ClearAllTextBoxes() {
    /*
    await page.focus("input[name=customer_id]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=customer_id]').value = "";
    });

    await page.focus("input[name=billing_account]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=billing_account]').value = "";
    });
    */

    await page.focus("input[name=company_name]");
    await page.waitFor(500);
    console.log("CLEARING!");
    await page.evaluate(function() {
        document.querySelector('input[name=company_name]').value = '';
    });
    await page.waitFor(1000);

    /*
    await page.focus("input[name=postal_code]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=postal_code]').value = "";
    });

    await page.focus(".address-field.form-group.std input");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('.address-field.form-group.std input').value = "";
    });

    await page.focus("input[name=street_line_2]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=street_line_2]').value = "";
    });

    await page.focus("input[name=city]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=city]').value = "";
    });

    await page.focus("input[name=state]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=state]').value = "";
    });

    await page.focus("input[name=person_full_name]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=person_full_name]').value = "";
    });

    await page.focus("input[name=phone]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=phone]').value = "";
    });

    await page.focus("input[name=phone_ext]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=phone_ext]').value = "";
    });

    await page.focus("input[name=email]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=email]').value = "";
    });

    await page.focus("input[name=mobile_phone]");
    await page.waitFor(100);
    await page.evaluate(function() {
        document.querySelector('input[name=mobile_phone]').value = "";
    });
    */
}