import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { queryCreateUser } from './query-create-user';
import { inputCreateUserOne, inputCreateUserTwo } from './constants';
import { generateToken } from '../utils/generate-token';
import { addUser, findUserById, toHashPassword } from '../functions';

describe('CreateUser Mutation', async () => {
  beforeEach(async () => {
    AppDataSource.getRepository(User);
  });

  afterEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  it('should create a user', async () => {
    const userOne = {
      ...inputCreateUserOne,
      password: await toHashPassword(inputCreateUserOne.password)
    };

    const user = await addUser(userOne);
    const token: string = generateToken(user);
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
    expect(userOne.password).to.be.equal(findUserOne.password);
  });

  it('should appear if the user passes an existing email', async () => {
    const user: User = await addUser(inputCreateUserOne);
    const token: string = generateToken(user);
    const newInput = { ...inputCreateUserTwo, email: inputCreateUserOne.email };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'Email already registered'
    );
    expect(response.data.errors[0].code).to.be.equal(409);
  });

  it('should appear an error if the password is less than 6 characters', async () => {
    const user: User = await addUser(inputCreateUserOne);
    const token: string = generateToken(user);
    const newInput = { ...inputCreateUserTwo, password: '1' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'Password must contain at least 6 characters'
    );
    expect(response.data.errors[0].code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 letter', async () => {
    const user: User = await addUser(inputCreateUserOne);
    const token: string = generateToken(user);
    const newInput = { ...inputCreateUserTwo, password: '123456' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 letter'
    );
    expect(response.data.errors[0].code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 digit', async () => {
    const user: User = await addUser(inputCreateUserOne);
    const token: string = generateToken(user);
    const newInput = { ...inputCreateUserTwo, password: 'abcdef' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 digit'
    );
    expect(response.data.errors[0].code).to.be.equal(400);
  });

  it('should appear an error if the token is not sent', async () => {
    const response = await queryCreateUser(inputCreateUserTwo, '');
    expect(response.data.errors[0].message).to.be.equal(
      'Authentication required'
    );
    expect(response.data.errors[0].code).to.be.equal(401);
  });

  it('should appear an error if the email is of an invalid format', async () => {
    const user: User = await addUser(inputCreateUserOne);
    const token: string = generateToken(user);
    const newInput = { ...inputCreateUserTwo, email: 'teste' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal('Invalid email format');
    expect(response.data.errors[0].code).to.be.equal(400);
  });
});
