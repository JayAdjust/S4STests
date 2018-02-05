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
        await page.waitFor(1500);

        return true;
    },

    onGenerateManifest: async (manifestType, manifestService, showManifestPricing) => {
        // click the "Manifest" print button
        await page.click(".shipments-action-button");
        await page.waitFor(1000);

        // change type if necessary
        // only 2 types: not_generated and generated
        if (manifestType !== "not_generated") {
            await page.select(".form-group.std.undefined select", "generated");
        }

        // change service if necessary
        // 3 types: dicom_express_canada, dicom_ec_usa, dicom_freight_canada
        // TODO: make it select the 2nd one
        //await page.select("select[name=interfaced_service]", manifestService);

        // click "Show manifest pricing" if necessary
        if (showManifestPricing) {
            await page.click(".checkbox-label");
        }

        // if there are no manifests to be made, return false
        var noManifestsErrorExists = !!(await page.$(".no-addresses"));
        if (noManifestsErrorExists) {
            return false;
        }

        // click the "Generate Manifest" button
        await page.click(".btn.btn-md.btn-secondary.inline");

        await page.waitFor(4000);
        return true;
    }
};