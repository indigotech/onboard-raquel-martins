import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { addUser, toHashPassword } from '../functions';
import { invalidId, inputCreateUserOne } from './constants';
import { queryGetUser } from './query-user';
import { generateFakeToken } from './functions';

describe('query user', async () => {
  const token: string = await generateFakeToken();
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
    const response = await queryGetUser(invalidId, token);
    expect(response.data.errors[0].message).to.be.equal('User not found.');
    expect(response.data.errors[0].code).to.be.equal(404);
  });

  it('should appear an error if token is invalid', async () => {
    const response = await queryGetUser(user.id, token.concat('a'));
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
