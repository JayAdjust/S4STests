import { _ } from '../Start/start_controller';

let page;
let browser;

export const Manifest = {
    Setup: () => {
		page = _.GetPage();
		browser = _.GetBrowser();
    },

    GoToManifests: async () => {
        // click the shipments tab in the sidebar
        await page.waitFor(100);
        await page.click(".side-bar div:nth-child(2) a");
        await page.waitFor(2000);

        return true;
    },

    onGenerateManifest: async (manifestType, manifestService) => {
        // click the "Manifest print" button
        await page.click(".shipments-action-button");
        await page.waitFor(400);

        // change type if necessary
        // only 2 types: not_generated and generated
        if (manifestType !== "not_generated") {
            await page.select(".form-group.std.undefined select", "generated");
        }

        await page.waitFor(1000);

        // change service if necessary
        // 3 types: dicom_express_canada, dicom_ec_usa, dicom_freight_canada
        await page.select("select[name=interfaced_service]", manifestService);

        await page.waitFor(10000);
        return true;
    }
};