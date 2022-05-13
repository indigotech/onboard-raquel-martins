import { config } from 'dotenv';
import { setup } from './setup';
import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from './data-source';
import { User } from '../entity/User';
import { QueryCreateUser } from './QueryCreateUser';
import { queryLogin } from './QueryLogin';
import * as jwt from 'jsonwebtoken';
import { secretKey } from '../secretKey';

before(async () => {
  config({ path: `${process.cwd()}/test.env` });
  await AppDataSource.initialize();
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
  name: 'UserTeste1',
  email: 'userteste1@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};
const input2 = {
  name: 'UserTeste2',
  email: 'userteste2@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};
describe('CreateUser Mutation', async () => {
  beforeEach(async () => {
    await AppDataSource.getRepository(User).delete({
      email: 'userteste1@email.com'
    });
  });

  it('should create a user', async () => {
    const response = await QueryCreateUser(input);
    const findUser = await AppDataSource.manager.findOneBy(User, {
      email: input.email
    });
    delete input.password;
    delete findUser.password;
    delete findUser.id;
    const { id, ...userFields } = response.data.data.createUser;
    expect(userFields).to.be.deep.eq(input);
    expect(id).to.be.a('string');
    expect(userFields.name).to.be.equal(findUser.name);
    expect(userFields.email).to.be.equal(findUser.email);
    expect(userFields.birthDate).to.be.equal(findUser.birthDate);
  });

  it('should appear if the user passes an existing email', async () => {
    await QueryCreateUser(input2);
    const response = await QueryCreateUser(input2);
    expect(response.data.errors[0].message).to.be.equal(
      'Email already registered'
    );
  });

  it('should appear an error if the password is less than 6 characters', async () => {
    const newInput = { ...input, password: '1' };
    const response = await QueryCreateUser(newInput);
    expect(response.data.errors[0].message).to.be.equal(
      'Password must contain at least 6 characters'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 letter', async () => {
    const newInput = { ...input, password: '123456' };
    const response = await QueryCreateUser(newInput);
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 letter'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 digit', async () => {
    const newInput = { ...input, password: 'abcdef' };
    const response = await QueryCreateUser(newInput);
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 digit'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  });
});

const loginInput = {
  email: 'userteste2@email.com',
  password: '1234abc'
};
describe('Login Mutation', async () => {
  beforeEach(async () => {
    await AppDataSource.getRepository(User);
  });

  it('should login', async () => {
    const findUser = await AppDataSource.manager.findOneBy(User, {
      email: loginInput.email
    });
    const response = await queryLogin(loginInput);
    const user = response.data.data.login.user;
    const token = response.data.data.login.token;
    const decoded = jwt.verify(token, secretKey);
    const tokenPayload = decoded as jwt.JwtPayload;
    expect(user).to.be.deep.equal(findUser);
    expect(tokenPayload.email).to.be.equal(findUser.email);
    expect(tokenPayload.userId).to.be.equal(findUser.id);
  });
});
