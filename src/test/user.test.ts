import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { Address } from '../entity/address';
import { addUser, toHashPassword } from '../functions';
import { randomId, inputCreateUserOne } from './constants';
import { queryGetUser } from './query-user';
import { generateToken } from '../utils/generate-token';
import { newAddress } from '../utils/data-generate-users';

describe('query user', () => {
  const token: string = generateToken(randomId);
  let user;

  beforeEach(async () => {
    const userOne = {
      ...inputCreateUserOne,
      password: await toHashPassword(inputCreateUserOne.password)
    };
    const userCreated = await addUser(userOne);
    user = { ...userCreated, addresses: [] };
  });
  afterEach(async () => {
    await AppDataSource.getRepository(User).delete({});
    await AppDataSource.getRepository(Address).delete({});
  });

  it('should return user info', async () => {
    const response = await queryGetUser(user.id, token);
    delete user.password;
    const userResponse = response.data.data.user;
    expect(user).to.be.deep.equal(userResponse);
  });

  it('should appear an error if user id does not exist in data base', async () => {
    const response = await queryGetUser(randomId, token);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('User not found.');
    expect(code).to.be.equal(404);
  });

  it('an error should appear if authentication is not passed', async () => {
    const response = await queryGetUser(user.id, '');
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Authentication required');
    expect(code).to.be.equal(401);
  });

  it('should return the address created', async () => {
    const randomAddress = await newAddress();
    const newInputAddress = {
      ...randomAddress,
      user: user.id
    };
    const createdAddressResponse = await AppDataSource.getRepository(
      Address
    ).save(newInputAddress);
    delete createdAddressResponse.user;

    const response = await queryGetUser(user.id, token);
    const expectedRes = { ...user, addresses: [createdAddressResponse] };
    delete expectedRes.password;
    const userResponse = response.data.data.user;
    expect(expectedRes).to.be.deep.equal(userResponse);
  });
});
