import * as Selectors from './page_selectors';

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
    }
}