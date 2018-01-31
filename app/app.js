import { _ } from './modules/StartUp/startUp_controller';
import * as SignUp from './modules/SignUp/signUp_controller';
import * as SignIn from './modules/SignIn/signIn_controller';
import * as WizardShipment from './modules/Shipments/wizard_shipment_controller';
import * as QuickShipment from './modules/Shipments/quick_shipment_controller';
import { Log } from './modules/Logging/logging';


// Main
(async() => {
    // setup
    await _.Run();
    await _.ChangeToDev();

    // tests
    //await SignUp.Run();

    await SignIn.Run();

    //await WizardShipment.Run();
    await QuickShipment.Run();
    // end tests
    Log.endAllTests();
})();