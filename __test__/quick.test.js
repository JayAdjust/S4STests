import { _ } from '../src/app/modules/Start/controller';
import * as Quick from '../src/app/modules/Shipments/controller';

beforeAll(async () => {
    await _.Run();
    await _.ChangeToDev();
    await Quick.Tests.Setup();
});

afterAll(() => {
    _.GetBrowser().close();
});