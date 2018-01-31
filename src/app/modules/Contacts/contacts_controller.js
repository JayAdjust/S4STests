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
    }
}