import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { queryCreateUser } from './queryCreateUser';
import { getToken } from '../functions';

const input: User = {
  id: '1234',
  name: 'UserTeste1',
  email: 'userteste1@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};
const input2: User = {
  id: '4321',
  name: 'UserTeste2',
  email: 'userteste2@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};

describe('CreateUser Mutation', async () => {
  beforeEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  it('should create a user', async () => {
    const token: string = getToken(input);
    const response = await queryCreateUser(input, token);
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
    const token: string = getToken(input2);
    await queryCreateUser(input2, token);
    const response = await queryCreateUser(input2, token);
    expect(response.data.errors[0].message).to.be.equal(
      'Email already registered'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(409);
  });

  it('should appear an error if the password is less than 6 characters', async () => {
    const token: string = getToken(input);
    const newInput = { ...input, password: '1' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'Password must contain at least 6 characters'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 letter', async () => {
    const token: string = getToken(input);
    const newInput = { ...input, password: '123456' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 letter'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 digit', async () => {
    const token: string = getToken(input);
    const newInput = { ...input, password: 'abcdef' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 digit'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  });
});
