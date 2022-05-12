import { config } from 'dotenv';
import { setup } from './setup';
import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from './data-source';
import { User } from '../entity/User';

before(async () => {
  config({ path: `${process.cwd()}/test.env` });
  await setup();
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
const input = {
  name: 'UserTeste',
  email: 'lucas1@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};
describe('CreateUser Mutation', async () => {
  beforeEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });
  it('should create a user', async () => {
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
    const { id, ...userFields } = response.data.data.createUser;
    expect(userFields).to.be.deep.eq(input);
    expect(id).to.be.a('string');
    expect(userFields.name).to.be.equal(input.name);
    expect(userFields.email).to.be.equal(input.email);
    expect(userFields.birthDate).to.be.equal(input.birthDate);
    expect(userFields.password).to.be.equal(input.password);
  });
  it('should appear if the user passes an existing email', async () => {
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
    expect(response.data.errors[0].message).to.be.equal(
      'Email already registered'
    );
  });
  it('should appear an error if the password is less than 6 characters', async () => {
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
        data: {
          ...input,
          password: '1'
        }
      }
    });
    expect(response.data.errors[0].message).to.be.equal(
      'Password must contain at least 6 characters'
    );
  });
  it('should appear an error if the password dont contain 1 letter', async () => {
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
        data: {
          ...input,
          password: '123456'
        }
      }
    });
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 letter'
    );
  });
  it('should appear an error if the password dont contain 1 digit', async () => {
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
        data: {
          ...input,
          password: 'abcdef'
        }
      }
    });
    console.log(response.data);
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 digit'
    );
  });
});
