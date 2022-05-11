import { config } from 'dotenv';
import { setup } from '../index';
import axios from 'axios';
import { expect } from 'chai';

before(async () => {
  config({ path: `${process.cwd()}/test.env` });
  await setup();
});

describe('console log', () => {
  it('teste', async () => {
    console.log('teste');
  });
});

describe('Hello Query', () => {
  it('should return hello message', async () => {
    const result = await axios.post('http://localhost:4000', {
      query: `
           query Hello {
            hello
            }
            `
    });
    expect(result.data).to.be.deep.eq({
      data: {
        hello: 'Hello world!'
      }
    });
  });
});
