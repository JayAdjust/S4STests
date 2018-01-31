import { _ } from './modules/Start/start_controller';
import * as SignUp from './modules/Signup/signup_controller';
import * as SignIn from './modules/Signin/signin_controller';
import * as WizardShipment from './modules/Shipments/wizard_controller';
import * as QuickShipment from './modules/Shipments/quick_controller';
import { Log } from './modules/Logging/logging';


// Main
(async() => {
    // setup
    await _.Run();
    await _.ChangeToDev();

    // tests
    await SignUp.Run();

    //await SignIn.Run();

    //await WizardShipment.Run();
    //await QuickShipment.Run();
    // end tests
    Log.endAllTests();
})();