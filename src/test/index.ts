import { config } from 'dotenv';
import { setup } from './setup';

before(async () => {
  config({ path: `${process.cwd()}/test.env` });
  await setup();
});

describe('Hello Query', () => {
  it('should return hello message', async () => {
    console.log('hello');
  });
});
