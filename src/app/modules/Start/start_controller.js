import puppeteer from 'puppeteer';

const APP = "https://shipping.dicom.com";
const DEV_API_URL = "https://dicom-dev.cleverbuild.biz/api/v1";

let page;
let browser;

export const _ = {
    Run: async() => {
        // open the browser
        browser = await puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });
            
        // open the dicom application
        page = await browser.newPage();
        await page.goto(APP);
        await page.setViewport({    // width and height of 0 make it match the parent's (in this case, the browser) height/width
            width: 0,
            height: 0,
            deviceScaleFactor: 1
        });
        await page.keyboard.press("F11");
        await page.keyboard.press("F11");
        let pages = await browser.pages();
        await pages[0].close();

        return true;
    },
    ChangeToDev: async() => {
        await page.click(".edit-url-btn"); 
        await page.focus(".url-input input");

        // clear the url that was already there (most likely the production site)
        await page.evaluate(function() {
            document.querySelector('.url-input input').value = '';
        });

        // enter the dev URL
        await page.type(".url-input input", DEV_API_URL);

        // click the save button
        await page.click(".edit-url-btn");
    },
    GetPage: () => { return page;},
    GetBrowser: () =>  {return browser;}
}