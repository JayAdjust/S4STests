import { _ } from '../Start/controller';
import { Quick } from './helper';

/**
 * Tests for Jest
 */
let page, browser;
export const Tests = {
    Setup: async (_page,_browser) => {
        page = _page;
        broswer = _browser;
        return (page != null && browser != null && Quick.Setup(_page,_browser));
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

