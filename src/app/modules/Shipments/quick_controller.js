import { _ } from '../Start/start_controller';
import { Quick } from './shipment_helper';

/**
 * Tests for Jest
 */ 
export const Tests = {
    Setup: async () => {
        Quick.Setup();
    },
        
    T1: async () => {
                
    }
}

async function CreateDomesticShipment(from, to, type, account){
    await Quick.GoToQuick();
}

async function CreateXBorderShipment(from, to){
    await Quick.GoToQuick();
}

