import puppeteer from 'puppeteer';
import { Log } from '../Logging/logging';

const APP = "https://shipping.dicom.com";
const DEV_API_URL = "https://dicom-dev.cleverbuild.biz/api/v1";

let page;
let browser;

export const _ = {
    Run: async() => {
        // open the browser
        Log.print("Starting the browser...");
        browser = await puppeteer.launch({
            headless: false,
            args: ['--start-fullscreen']
        });
        Log.printLine("done");
            
        // open the dicom application
        Log.print("Going to the dicom website...");
        page = await browser.newPage();
        await page.goto(APP);
        await page.setViewport({
            width: 1000,
            height: 1080
        });

        await page.waitFor(1000);
        Log.printLine("done");
    },
    ChangeToDev: async() => {
        Log.print("Changing to dev...");

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
        Log.printLine("done");
    },
    GetPage: () => { return page;},
    GetBrowser: () =>  {return browser;}
}