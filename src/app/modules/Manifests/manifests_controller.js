import { _ } from '../Start/start_controller';
import { Manifest } from './manifests_helper';

/**
 * Tests for Jest
 */ 
export const Tests = {
    Setup: () => {
        Manifest.Setup();
    },

    T1: async () => {
        return await Manifest.GoToManifests();
    },

    T2: async() => {
        return await Manifest.onGenerateManifest("not_generated", "dicom_express_canada", true);
    }
};