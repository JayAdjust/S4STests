import { _ } from '../Start/start_controller';
import { Product } from './products_helper';

let page;
let browser;

/**
 * Tests for Jest
 */ 
export const Tests = {
    Setup: () => {
		Product.Setup();
    },
    GoToProducts: async () => {
        return await Product.GoToProducts();
    }
};