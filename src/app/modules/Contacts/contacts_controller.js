import { _ } from '../Start/start_controller';
import { Contact } from './contact_helper';

/**
 * Tests for Jest
 */ 
export const Tests = {
    Setup: () => {
        Contact.Setup();
    },
        
    T1: async () => {
        return await Contact.GoToContacts();
    },

    T2: async () => {
        // customerID, billingAccount, company, country, postalCode, address, addressLine2, city, province, attentionTo, phone, phoneExt, email, mobilePhone
        return await Contact.onCreateContact("", "", "Jared Company", "CA", "H9K1M2", "17960 Rue Foster", "", "Montreal", "Quebec", "Some Contact", "5141111111", "", "", "");
    }
}