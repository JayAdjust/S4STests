import { _ } from '../Start/controller';
import { Product } from './helper';

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