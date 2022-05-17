import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { addUser, toHashPassword, generateToken } from '../functions';
import { invalidId } from './constants/invalid-id';
import { invalidToken } from './constants/invalid-token';
import { queryGetUser } from './query-user';

const input = {
  name: 'User',
  email: 'userteste@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};

describe('query user', async () => {
  beforeEach(async () => {
    AppDataSource.getRepository(User);
  });
  afterEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  it('should return user info', async () => {
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };
    const user = await addUser(userOne);
    const token: string = generateToken(user);
    const response = await queryGetUser(user.id, token);
    delete user.password;
    const userResponse = response.data.data.user;
    expect(user).to.be.deep.equal(userResponse);
  });

  it('should appear an error if user id does not exist in data base', async () => {
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };
    const user = await addUser(userOne);
    const token: string = generateToken(user);
    const response = await queryGetUser(invalidId, token);
    expect(response.data.errors[0].message).to.be.equal('User not found.');
    expect(response.data.errors[0].code).to.be.equal(404);
  });

  it('should appear an error if token is invalid', async () => {
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };
    const user = await addUser(userOne);
    const response = await queryGetUser(user.id, invalidToken);
    expect(response.data.errors[0].message).to.be.equal('Invalid token');
    expect(response.data.errors[0].code).to.be.equal(401);
  });

  it('an error should appear if authentication is not passed', async () => {
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };
    const user = await addUser(userOne);
    const response = await queryGetUser(user.id, '');
    expect(response.data.errors[0].message).to.be.equal(
      'Authentication required'
    );
    expect(response.data.errors[0].code).to.be.equal(401);
  });
});
