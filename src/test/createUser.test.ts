import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { queryCreateUser } from './queryCreateUser';
import { addUser, getToken } from '../functions';

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
    await AppDataSource.getRepository(User).delete({});
  });

  it('should create a user', async () => {
    const user: User = await addUser(input);
    const token: string = getToken(user);
    const response = await queryCreateUser(input2, token);
    const findUser = await AppDataSource.manager.findOneBy(User, {
      email: input2.email
    });

    delete input2.password;
    delete findUser.password;
    delete findUser.id;
    const { id, ...userFields } = response.data.data.createUser;
    expect(userFields).to.be.deep.eq(input2);
    expect(id).to.be.a('string');
    expect(userFields.name).to.be.equal(findUser.name);
    expect(userFields.email).to.be.equal(findUser.email);
    expect(userFields.birthDate).to.be.equal(findUser.birthDate);
  });

  it('should appear if the user passes an existing email', async () => {
    const user: User = await addUser(input);
    const token: string = getToken(user);
    await queryCreateUser(input, token);
    const response = await queryCreateUser(input, token);
    expect(response.data.errors[0].message).to.be.equal(
      'Email already registered'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(409);
  });

  it('should appear an error if the password is less than 6 characters', async () => {
    const user: User = await addUser(input);
    const token: string = getToken(user);
    const newInput = { ...input, password: '1' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'Password must contain at least 6 characters'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 letter', async () => {
    const user: User = await addUser(input);
    const token: string = getToken(user);
    const newInput = { ...input2, password: '123456' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 letter'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  });

  it('should appear an error if the password does not contain 1 digit', async () => {
    const user: User = await addUser(input);
    const token: string = getToken(user);
    const newInput = { ...input2, password: 'abcdef' };
    const response = await queryCreateUser(newInput, token);
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 digit'
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  });
});
