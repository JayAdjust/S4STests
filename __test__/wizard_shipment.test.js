import { _ } from '../src/app/modules/Start/start_controller';
import * as Wizard from '../src/app/modules/Shipments/wizard_controller';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    await Wizard.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});