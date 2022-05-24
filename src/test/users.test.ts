import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { Address } from '../entity/address';
import { User } from '../entity/user';
import { newAddress, newUser } from '../utils/data-generate-users';
import { generateToken } from '../utils/generate-token';
import { randomId } from './constants';
import { queryGetAllUsers } from './query-users';

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
          birthDate: user.birthDate,
          addresses: []
        };
        return newUser;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    arrayUsers = arrayMapUsers;
  });

  after(async () => {
    await AppDataSource.getRepository(User).delete({});
    await AppDataSource.getRepository(Address).delete({});
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
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Authentication required');
    expect(code).to.be.equal(401);
  });

  it('should return addresses', async () => {
    const randomAddress = await newAddress();
    const inputCreateAddress = { ...randomAddress, user: arrayUsers[0].id };
    const addressSaved = await AppDataSource.getRepository(Address).save(
      inputCreateAddress
    );
    delete addressSaved.user;

    const response = await queryGetAllUsers(token, 1, 1);
    const addressResponse = response.data.data.users.users[0];
    const expectedRes = {
      ...arrayUsers[0],
      addresses: [addressSaved]
    };
    expect(expectedRes).to.be.deep.equal(addressResponse);
  });
});
