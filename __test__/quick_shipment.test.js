import { _ } from '../src/app/modules/Start/start_controller';
import * as Quick from '../src/app/modules/Shipments/quick_controller';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    await Quick.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});