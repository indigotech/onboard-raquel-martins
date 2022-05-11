import { config } from 'dotenv';
import { setup, addUser } from './setup';
import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from './data-source';
import { User } from '../entity/User';

before(async () => {
  config({ path: `${process.cwd()}/test.env` });
  await setup();
});

describe('Mutation user', () => {
  beforeEach(async () => {
    await addUser({
      name: 'Cirilo',
      email: 'cirilo@email.com',
      password: '123456abc',
      birthDate: '01-01-2000'
    });
  });
});

describe('Hello Query', () => {
  it('should return hello message', async () => {
    const result = await axios.post('http://localhost:4001', {
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

describe('CreateUser Mutation', async () => {
  beforeEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });
  it('should create a user', async () => {
    const input = {
      name: 'UserTeste',
      email: 'user@email.com',
      password: '1234abc',
      birthDate: '10-10-2000'
    };
    const response = await axios.post('http://localhost:4001', {
      query: `
        mutation createUser($data: UserInput!){
        createUser(data: $data){
          id
          name
          email
          birthDate
        }  
      }
    `,
      variables: {
        data: input
      }
    });
    delete input.password;
    console.log(response.data);
    const { id, ...userFields } = response.data.data.createUser;
    console.log(id, userFields);
    expect(userFields).to.be.deep.eq(input);
  });
});
