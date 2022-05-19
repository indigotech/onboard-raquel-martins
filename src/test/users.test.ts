//import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { queryGetAllUsers } from './query-users';
import { expect } from 'chai';
import { newUser } from '../utils/data-generate-users';
import { generateFakeToken } from './functions';

describe('query users', async () => {
  const users = [];
  const token: string = await generateFakeToken();

  beforeEach(async () => {
    for (let i = 0; i < 20; i++) {
      users.push(await newUser());
    }

    AppDataSource.getRepository(User).save(users);
  });

  afterEach(async () => {
    AppDataSource.getRepository(User).delete({});
  });

  it('should return a vector of users', async () => {
    const response = await queryGetAllUsers(token, 1, 20);
    const listUsersResponse = response.data.data.users.users;
    const count = response.data.data.users.count;
    const before = response.data.data.users.before;
    const after = response.data.data.users.after;

    const formatArray = users
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

    expect(listUsersResponse).to.be.deep.equal(formatArray);
    expect(formatArray.length).to.be.equal(count);
    expect(before).to.be.equal(0);
    expect(after).to.be.equal(0);
  });

  it('an error should appear if authentication is not passed', async () => {
    const response = await queryGetAllUsers('', 1, 10);

    expect(response.data.errors[0].message).to.be.equal(
      'Authentication required'
    );
    expect(response.data.errors[0].code).to.be.equal(401);
  });
});
