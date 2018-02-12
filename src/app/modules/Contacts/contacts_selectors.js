export const Selectors = {
    buttons: {
        edit: "section.contact-entry-detail > div > div.actions.edit-actions > button",
    },
    inputs: {
        customer_id: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(1) > div:nth-child(1) > input",
        billing_account: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(1) > div:nth-child(2) > input",
        company: "section.contact-entry-detail.edit > div.addressForm-holder > div > div.company-field.form-group.std > input",
        postal_code: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(3) > div:nth-child(2) > input",
        address: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(4) > div.address-field.form-group.std > input",
        address_2: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(4) > div.form-group.std.undefined > input",
        city: "section.contact-entry-detail.edit > div.addressForm-holder > div > div.control-group.split.province-wrapper > div.form-group.std.undefined > input",
        province: "section.contact-entry-detail.edit > div.addressForm-holder > div > div.control-group.split.province-wrapper > div:nth-child(2) > div > div > input.form-control.bootstrap-typeahead-input-main.has-selection",
        attention_to: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(6) > div > input",
        phone: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(7) > div:nth-child(1) > input",
        phone_ext: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(7) > div:nth-child(2) > input",
        email: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(8) > div:nth-child(1) > input",
        mobile_phone: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(8) > div:nth-child(2) > input",
    },
    spans: {
        close: "section.contact-entry-detail.edit > span > i",
    },
    selects: {
        steps: "div.page-footer > div.page-status > div.form-group.std.page-step > select",
        country: "section.contact-entry-detail.edit > div.addressForm-holder > div > div:nth-child(3) > div:nth-child(1) > select",
    },
    sections: {
        contact_list: "section.contact-entry-list",
    }
}