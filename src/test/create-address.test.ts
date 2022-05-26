import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { Address } from '../entity/address';
import { User } from '../entity/user';
import { addUser, getUserById } from '../functions';
import { generateToken } from '../utils/generate-token';
import { inputAddress, inputCreateUserOne, randomId } from './constants';
import { queryCreateAddress } from './query-create-address';

describe('CreateAddress Mutation', () => {
  const token: string = generateToken(randomId);
  let user;

  beforeEach(async () => {
    user = await addUser(inputCreateUserOne);
  });

  afterEach(async () => {
    await AppDataSource.getRepository(Address).delete({});
    await AppDataSource.getRepository(User).delete({});
  });

  it('should create a address', async () => {
    const newInputAddress = {
      ...inputAddress,
      userId: user.id
    };
    const { userId, ...address } = newInputAddress;
    const response = await queryCreateAddress(newInputAddress, token);
    const addressResponse = response.data.data.createAddress;
    const [findAddress] = await AppDataSource.manager.find(Address);
    const findUserById = await getUserById(userId);
    const expectedResponse = {
      ...user,
      addresses: [findAddress]
    };
    const addressInput = { ...address, id: addressResponse.id };
    expect(addressInput).to.be.deep.equal(addressResponse);
    expect(expectedResponse).to.be.deep.equal(findUserById);
    expect(userId).to.be.equal(user.id);
    expect(addressResponse).to.be.deep.equal(findAddress);
  });

  it('should appear an error if the token is not sent', async () => {
    const newInputAddress = {
      ...inputAddress,
      userId: user.id
    };
    const response = await queryCreateAddress(newInputAddress, '');
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Authentication required');
    expect(code).to.be.equal(401);
  });

  it('should appear an error if user id is not sent', async () => {
    const newInputAddress = {
      ...inputAddress,
      userId: ''
    };
    const response = await queryCreateAddress(newInputAddress, token);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Id not found');
    expect(code).to.be.equal(404);
  });
});
