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
    },
    T1: async () => {
        return await Product.onCreateProduct("1234", "SOME PRODUCT NAME", "This is an awesome product!", "", "1.26", true, "Angola", [], []);
    }
};