import axios from 'axios';
import { BASE_URL } from './BASE_URL';
import { expect } from 'chai';

describe('Hello Query', () => {
  it('should return hello message', async () => {
    const result = await axios.post(`${BASE_URL}`, {
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
