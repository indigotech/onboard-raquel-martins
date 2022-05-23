import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { addUser, toHashPassword } from '../functions';
import { randomId, inputCreateUserOne, invalidToken } from './constants';
import { queryGetUser } from './query-user';
import { generateToken } from '../utils/generate-token';

describe('query user', () => {
  const token: string = generateToken(randomId);
  let user;

  beforeEach(async () => {
    AppDataSource.getRepository(User);
    const userOne = {
      ...inputCreateUserOne,
      password: await toHashPassword(inputCreateUserOne.password)
    };
    const userCreated = await addUser(userOne);
    user = userCreated;
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

  it('should appear an error if user id does not exist in data base', async () => {
    const response = await queryGetUser(randomId, token);
    expect(response.data.errors[0].message).to.be.equal('User not found.');
    expect(response.data.errors[0].code).to.be.equal(404);
  });

  it('should appear an error if token is invalid', async () => {
    const response = await queryGetUser(user.id, invalidToken);
    console.log(response.data.errors[0]);
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
