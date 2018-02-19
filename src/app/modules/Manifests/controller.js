import { Manifest } from './helper';

let page, browser;

export const Tests = {
    Setup: (_page, _browser) => {
        page = _page;
        browser = _browser;
        return (page != null && browser != null && Manifest.Setup(_page, _browser));
    },
    GoToManifest: async () => {
        return await Manifest.GoToManifests();
    },
    T1: async () => {
        return await Manifest.onGenerateManifest("not_generated", "dicom_express_canada", false, "today", "all");
    },
    T2: async () => {
        return await Manifest.onGenerateManifest("not_generated", "dicom_ec_usa", false, "today", "all");
    },
    T3: async () => {
        return await Manifest.onGenerateManifest("not_generated", "dicom_freight_canada", false, "today", "all");
    },
    T4: async () => {
        // Create test shipments
    },
    T5: async () => {
        // Generate manifests with previous shipments
        return await Manifest.onGenerateManifest("not_generated", "dicom_express_canada", true, "today", "all");
    }
};