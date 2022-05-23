//import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { addUser, toHashPassword, generateToken } from '../functions';
import { queryGetAllUsers } from './query-users';
import { input } from './constants';
import { expect } from 'chai';
import { invalidToken } from './constants';
import { newUser } from '../utils/data-generate-users';

describe('query users', async () => {
  const users = [];
  let token: string;

  beforeEach(async () => {
    for (let i = 0; i < 20; i++) {
      users.push(await newUser());
    }

    AppDataSource.getRepository(User).save(users);
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };

    const user = await addUser(userOne);
    users.push(user);
    token = generateToken(user);
  });

  afterEach(async () => {
    AppDataSource.getRepository(User).delete({});
  });

  it('should return a vector of users', async () => {
    const formatArray = users
      .map((user) => {
        const userNew = {
          id: user.id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate
        };
        return userNew;
      })
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });

    const response = await queryGetAllUsers(token, 1, 21);
    const response2 = await queryGetAllUsers(token, 1, 10);
    const listUsersResponse = response.data.data.users.users;
    const count = response.data.data.users.count;
    const before = response.data.data.users.before;
    const after = response.data.data.users.after;
    const count2 = response2.data.data.users.count;
    const before2 = response2.data.data.users.before;
    const after2 = response2.data.data.users.after;

    expect(listUsersResponse).to.be.deep.equal(formatArray);
    expect(formatArray.length).to.be.equal(count);
    expect(before).to.be.equal(0);
    expect(after).to.be.equal(0);
    expect(count2).to.be.equal(21);
    expect(before2).to.be.equal(0);
    expect(after2).to.be.equal(11);
  });

  it('should appear an error if token is invalid', async () => {
    const response = await queryGetAllUsers(invalidToken, 1, 10);

    expect(response.data.errors[0].message).to.be.equal('Invalid token');
    expect(response.data.errors[0].code).to.be.equal(401);
  });

  it('an error should appear if authentication is not passed', async () => {
    const response = await queryGetAllUsers('', 1, 10);

    expect(response.data.errors[0].message).to.be.equal(
      'Authentication required'
    );
    expect(response.data.errors[0].code).to.be.equal(401);
  });
});
