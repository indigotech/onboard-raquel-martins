//import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { addUser, toHashPassword, generateToken } from '../functions';
import { queryGetAllUsers } from './query-users';
import { input } from './constants/input';
import { expect } from 'chai';
import { invalidToken } from './constants/invalid-token';

describe('query users', async () => {
  beforeEach(async () => {
    AppDataSource.getRepository(User);
  });
  afterEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  it('should return a vector of users', async () => {
    const arrUsers = [];
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };
    const user = await addUser(userOne);
    const token: string = generateToken(user);
    const response = await queryGetAllUsers(token, 1, 10);
    const listUsersResponse = response.data.data.users.users;
    delete user.password;
    arrUsers.push(user);
    expect(listUsersResponse).to.be.deep.equal(arrUsers);
  });

  it('should appear an error if token is invalid', async () => {
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };
    await addUser(userOne);
    const response = await queryGetAllUsers(invalidToken, 1, 10);
    expect(response.data.errors[0].message).to.be.equal('Invalid token');
    expect(response.data.errors[0].code).to.be.equal(401);
  });

  it('an error should appear if authentication is not passed', async () => {
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };
    await addUser(userOne);
    const response = await queryGetAllUsers('', 1, 10);
    expect(response.data.errors[0].message).to.be.equal(
      'Authentication required'
    );
    expect(response.data.errors[0].code).to.be.equal(401);
  });
});
