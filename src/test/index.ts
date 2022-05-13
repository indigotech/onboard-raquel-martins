import { config } from 'dotenv';
import { setup } from '../setup';

config({ path: `${process.cwd()}/test.env` });

before(async () => {
  await setup();
});

require('./hello.test');

require('./createUser.test');
