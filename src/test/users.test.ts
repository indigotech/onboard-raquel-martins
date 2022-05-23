import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { queryGetAllUsers } from './query-users';
import { expect } from 'chai';
import { newUser } from '../utils/data-generate-users';
import { generateToken } from '../utils/generate-token';
import { randomId } from './constants';

describe('Query users', () => {
  const users = [];
  const token: string = generateToken(randomId);
  let arrayUsers;

  before(async () => {
    for (let i = 0; i < 33; i++) {
      users.push(await newUser());
    }

    await AppDataSource.getRepository(User).save(users);

    const arrayMapUsers = users
      .map((user) => {
        const newUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate
        };
        return newUser;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    arrayUsers = arrayMapUsers;
  });

  after(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  it('should return a vector of users', async () => {
    const response = await queryGetAllUsers(token, 1, 10);

    const expectedUsers = arrayUsers.slice(0, 10);
    const listUsersResponse = response.data.data.users;
    const expectedResponse = {
      users: expectedUsers,
      count: 33,
      before: 0,
      after: 23,
      page: 1
    };
    expect(listUsersResponse).to.be.deep.equal(expectedResponse);
  });

  it('should return the following values on intermediary page', async () => {
    const response = await queryGetAllUsers(token, 2, 10);

    const expectedUsers = arrayUsers.slice(10, -13);
    const listUsersResponse = response.data.data.users;
    const expectedResponse = {
      users: expectedUsers,
      count: 33,
      before: 10,
      after: 13,
      page: 2
    };
    expect(listUsersResponse).to.be.deep.equal(expectedResponse);
  });

  it('should return the following values on last page', async () => {
    const response = await queryGetAllUsers(token, 4, 10);

    const expectedUsers = arrayUsers.slice(30);
    const listUsersResponse = response.data.data.users;
    const expectedResponse = {
      users: expectedUsers,
      count: 33,
      before: 30,
      after: 0,
      page: 4
    };
    expect(listUsersResponse).to.be.deep.equal(expectedResponse);
  });

  it('should return page values without users', async () => {
    const response = await queryGetAllUsers(token, 5, 10);
    const listUsersResponse = response.data.data.users;
    const expectedResponse = {
      users: [],
      count: 33,
      before: 33,
      after: 0,
      page: 5
    };
    expect(listUsersResponse).to.be.deep.equal(expectedResponse);
  });

  it('an error should appear if authentication is not passed', async () => {
    const response = await queryGetAllUsers('', 1, 10);

    expect(response.data.errors[0].message).to.be.equal(
      'Authentication required'
    );
    expect(response.data.errors[0].code).to.be.equal(401);
  });
});
