import { _ } from '../Start/start_controller';
import faker from "faker";
import { Contact } from './contact_helper';

/**
 * Tests for Jest
 */ 
export const Tests = {
    Setup: () => {
        Contact.Setup();
    },
    GoToContacts: async () => {
        return await Contact.GoToContacts();
    },
    T1: async () => {
        return await Contact.onCreateContact("", "", "Jared", "CA", "H9K1M2", "1234 BAD ADDRESS", "", "Montreal", "Quebec", "Some Contact", "5141111111", "", "", "", false);
    },
    T2: async () => {
        return await Contact.onCreateContact("", "", "Jaredddddddddddd", "CA", "H9K1M2", "", "", "Montreal", "Quebec", "Some Contact", "5141111111", "", "", "", false);
    },
    T3: async () => {
        return await Contact.onCreateContact("", "", "", "CA", "H9K1M2", "17960 Rue Foster", "", "Montreal", "Quebec", "Some Contact", "5141111111", "", "", "", false);
    }
}