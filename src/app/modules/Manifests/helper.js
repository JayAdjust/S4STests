let page;
let browser;

export const Manifest = {
    Setup: (_page, _browser) => {
		page = _page;
        browser = _browser;
        return page != null && browser != null;
    },
    GoToManifests: async () => {
        // click the shipments tab in the sidebar
        await page.waitFor(100);
        await page.click(".side-bar div:nth-child(2) a");
        await page.waitFor(1500);

        return !!(await page.$('.shipment-table-container'));
    },
    








    onGenerateManifest: async (manifestType, manifestService, showManifestPricing, manifestTIme, arrayOfManifestsToTake) => {
        // we can't generate manifests if we are not on the page!
        var isOnManifestPage = !!(await page.$('.shipment-table-container'));
        if (!isOnManifestPage) {
            return {totalManifests: 0, manifestsGenerated: 0, success: false};
        }

        // since we are on the page, click the "Manifest" print button
        await page.click(".shipments-action-button");
        await page.waitFor(1000);

        // change type if necessary
        // only 2 types: not_generated and generated
        if (manifestType !== "not_generated") {
            await page.select(".form-group.std.undefined select", "generated");
        }

        // change service if necessary
        await page.select(".manifest-selection-container select[name=interfaced_service]", manifestService);
        await page.waitFor(1000); // big timing window

        // change manifest time range
        //await page.click(".dicon-calendar");
        //await page.waitFor(1000);
        //await page.hover(".daterangepicker.dropdown-menu.ltr.opensright ul:nth-child(3)");
        //await page.waitFor(5000);
        //await page.click(".ranges li:nth-child(1)");
        //await page.waitFor(3000);

        // get the total amount of manifests
        var totalManifests = await page.evaluate(() => {
            return document.getElementsByClassName("pickup-address-item").length;
        });

        // if there are no manifests to be made, return false
        if (totalManifests === 0) {
            return {totalManifests: 0, manifestsGenerated: 0, success: false};
        }

        // click "Show manifest pricing" if necessary
        if (showManifestPricing) {
            await page.click(".checkbox-label");
            await page.waitFor(300); // needed, or bugs will occur
        }

        // get manifest indexes to select depending on what option was passed in
        if (arrayOfManifestsToTake === "all") {
            arrayOfManifestsToTake = [];
            for (var i = 0; i < totalManifests; i++) {
                arrayOfManifestsToTake.push(i + 1);
            }
        } else if (arrayOfManifestsToTake === "random") {
            arrayOfManifestsToTake = [];
            for (var i = 0; i < totalManifests; i++) {
                var randomBoolean = (Math.random() >= 0.5);
                if (randomBoolean) {
                    arrayOfManifestsToTake.push(i + 1);
                }
            }
        }

        // loop through the array of manifests to take and select them
        for (var i = 0; i < arrayOfManifestsToTake.length; i++) {
            var a = arrayOfManifestsToTake[i] + 1;
            await page.click(".pickup-address-list div:nth-child(" + a + ") label");
            await page.waitFor(300);
        }

        // click the "Generate Manifest" button
        var pages = await browser.pages();
        var beforeCount = pages.length;
        await page.click(".btn.btn-md.btn-secondary.inline");
        await page.waitFor(500);

        // wait for the manifest file to generate
	    pages = await browser.pages();
	    while (pages.length < beforeCount + 1) {
		    await page.waitFor(1000);
		    pages = await browser.pages();
	    }

        var popup = pages.pop();
        await popup.waitFor(7500); // Give the popup time to load

        return {totalManifests: totalManifests, manifestsGenerated: arrayOfManifestsToTake.length, success: true};
    }
};