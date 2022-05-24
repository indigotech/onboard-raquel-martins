import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { queryCreateUser } from './query-create-user';
import { inputCreateUserOne, inputCreateUserTwo, randomId } from './constants';
import { generateToken } from '../utils/generate-token';
import { findUserById, toHashPassword } from '../functions';

describe('CreateUser Mutation', async () => {
  const token: string = generateToken(randomId);
  let user;
  beforeEach(async () => {
    const userOne = {
      ...inputCreateUserOne,
      password: await toHashPassword(inputCreateUserOne.password)
    };
    await AppDataSource.getRepository(User).save(userOne);
    user = userOne;
  });

  afterEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  it('should create a user', async () => {
    const response = await queryCreateUser(inputCreateUserTwo, token);
    const findUser = await AppDataSource.manager.findOneBy(User, {
      email: inputCreateUserTwo.email
    });
    const findUserOne = await findUserById(user.id);
    const { id, ...userFields } = response.data.data.createUser;
    expect(id).to.be.a('string');
    expect(userFields.name).to.be.deep.equal(findUser.name);
    expect(userFields.email).to.be.equal(findUser.email);
    expect(userFields.birthDate).to.be.equal(findUser.birthDate);
    expect(id).to.be.equal(findUser.id);
    expect(user.password).to.be.equal(findUserOne.password);
  });

  it('should appear if the user passes an existing email', async () => {
    const newInput = { ...inputCreateUserTwo, email: inputCreateUserOne.email };
    const response = await queryCreateUser(newInput, token);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Email already registered');
    expect(code).to.be.equal(409);
  });

  it('should appear an error if the password is less than 6 characters', async () => {
    const newInput = { ...inputCreateUserTwo, password: '1' };
    const response = await queryCreateUser(newInput, token);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Password must contain at least 6 characters');
    expect(code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 letter', async () => {
    const newInput = { ...inputCreateUserTwo, password: '123456' };
    const response = await queryCreateUser(newInput, token);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('The password must contain at least 1 letter');
    expect(code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 digit', async () => {
    const newInput = { ...inputCreateUserTwo, password: 'abcdef' };
    const response = await queryCreateUser(newInput, token);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('The password must contain at least 1 digit');
    expect(code).to.be.equal(400);
  });

  it('should appear an error if the token is not sent', async () => {
    const response = await queryCreateUser(inputCreateUserTwo, '');
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Authentication required');
    expect(code).to.be.equal(401);
  });

  it('should appear an error if the email is of an invalid format', async () => {
    const newInput = { ...inputCreateUserTwo, email: 'teste' };
    const response = await queryCreateUser(newInput, token);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Invalid email format');
    expect(code).to.be.equal(400);
  });
});
