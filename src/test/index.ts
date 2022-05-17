import { config } from 'dotenv';
import { setup } from '../setup';

config({ path: `${process.cwd()}/test.env` });

before(async () => {
  await setup();
});

require('./create-user.test');

require('./login.test');

require('./user.test');
