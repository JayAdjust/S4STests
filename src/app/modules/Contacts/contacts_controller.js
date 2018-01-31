import { _ } from '../Start/start_controller';
import { Contact } from './contact_helper';
import { SignIn } from '../Signin/signin_helper'

/**
 * Tests for Jest
 */ 
export const Tests = {
    Setup: async () => {
        SignIn.Setup();
        await SignIn.onSignIn("Jeremy@dicom.com", "test123");
    },
        
    T1: async () => {
        
    }
}