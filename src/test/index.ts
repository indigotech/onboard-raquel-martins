import { config } from 'dotenv';

config();

console.log(process.env.DB_NAME);

describe('Hello Query', () => {
  it('should return hello message', async () => {
    console.log('hello');
  });
});
