import { _ } from '../Start/start_controller';
import { Manifest } from './manifests_helper';

/**
 * Tests for Jest
 */ 
export const Tests = {
    Setup: () => {
        Manifest.Setup();
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
        //return await Manifest.onGenerateManifest("not_generated", "dicom_express_canada", true, "today", "all");
    }
};