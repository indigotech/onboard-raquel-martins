import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { addUser, toHashPassword, generateToken } from '../functions';
import { invalidId, input, fakeUser } from './constants';
import { queryGetUser } from './query-user';

describe('query user', async () => {
  let token: string;
  let user;
  let randomToken;
  beforeEach(async () => {
    AppDataSource.getRepository(User);
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };
    const userCreated = await addUser(userOne);
    const tokenCreated: string = generateToken(userCreated);
    token = tokenCreated;
    user = userCreated;
    randomToken = generateToken(fakeUser);
  });
  afterEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  it('should return user info', async () => {
    const response = await queryGetUser(user.id, token);
    delete user.password;
    const userResponse = response.data.data.user;
    expect(user).to.be.deep.equal(userResponse);
  });

  it.only('should appear an error if user id does not exist in data base', async () => {
    const response = await queryGetUser(invalidId, token);
    expect(response.data.errors[0].message).to.be.equal('User not found.');
    expect(response.data.errors[0].code).to.be.equal(404);
  });

  it('should appear an error if token is invalid', async () => {
    const response = await queryGetUser(user.id, randomToken);
    expect(response.data.errors[0].message).to.be.equal('Invalid token');
    expect(response.data.errors[0].code).to.be.equal(401);
  });

  it('an error should appear if authentication is not passed', async () => {
    const response = await queryGetUser(user.id, '');
    expect(response.data.errors[0].message).to.be.equal(
      'Authentication required'
    );
    expect(response.data.errors[0].code).to.be.equal(401);
  });
});
