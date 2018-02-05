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
    onGenerateManifest: async (manifestType, manifestService, showManifestPricing, arrayOfManifestsToTake) => {
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
        await page.select(".manifest-selection-container select[name=interfaced_service]", manifestService);
        await page.waitFor(1000); // big timing window

        // if there are no manifests to be made, return false
        // get the total amount of manifests
        var totalManifests = await page.evaluate(() => {
            return document.getElementsByClassName("pickup-address-item").length;
        });

        if (totalManifests === 0) {
            return false;
        }

        // click "Show manifest pricing" if necessary
        if (showManifestPricing) {
            await page.click(".checkbox-label");
        }

        // update the arrayOfManifestsToTake array to loop through later
        if (arrayOfManifestsToTake === "all") {
            arrayOfManifestsToTake = [];
            for (var i = 0; i < totalManifests; i++) {
                arrayOfManifestsToTake.push(i + 1);
            }
        } else if (arrayOfManifestsToTake === "some") {
            arrayOfManifestsToTake = [];
            for (var i = 0; i < totalManifests; i++) {
                var randomBoolean = (Math.random() >= 0.5);
                if (randomBoolean) {
                    arrayOfManifestsToTake.push(i + 1);
                }
            }
        }

        // loop through the array of manifests to take and select them
        // TODO: fix this
        console.log("Total manifests: " + totalManifests + ". Selecting manifests: " + arrayOfManifestsToTake);
        for (var i = 0; i < arrayOfManifestsToTake.length; i++) {
            console.log("in loop for manifest: " + arrayOfManifestsToTake[i])
            let x = arrayOfManifestsToTake[i] + 1;
            await page.click(".pickup-address-list div:nth-child(" + x + ")");
        }

        // click the "Generate Manifest" button
        //await page.click(".btn.btn-md.btn-secondary.inline");

        await page.waitFor(10000);
        return true;
    }
};