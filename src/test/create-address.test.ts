import { AppDataSource } from '../data-source';
import { inputAddress, inputCreateUserOne, randomId } from './constants';
import { generateToken } from '../utils/generate-token';
import { Address } from '../entity/address';
import { User } from '../entity/user';
import { queryCreateAddress } from './query-create-address';
import { addUser } from '../functions';
import { expect } from 'chai';

describe('CreateAddress Mutation', () => {
  const token: string = generateToken(randomId);
  let user;

  beforeEach(async () => {
    const saveUser = await addUser(inputCreateUserOne);
    user = saveUser;
  });

  afterEach(async () => {
    await AppDataSource.getRepository(Address).delete({});
    await AppDataSource.getRepository(User).delete({});
  });

  it('should create a address', async () => {
    const newInputAddress = {
      ...inputAddress,
      user: user.id
    };
    const response = await queryCreateAddress(newInputAddress, token);
    const addressResponse = response.data.data.createAddress;
    delete newInputAddress.user;
    delete addressResponse.id;
    expect(addressResponse).to.be.deep.equal(newInputAddress);
  });

  it('should appear an error if the token is not sent', async () => {
    const newInputAddress = {
      ...inputAddress,
      user: user.id
    };
    const response = await queryCreateAddress(newInputAddress, '');
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Authentication required');
    expect(code).to.be.equal(401);
  });

  it('should appear an error if user id is not sent', async () => {
    const newInputAddress = {
      ...inputAddress,
      user: ''
    };
    const response = await queryCreateAddress(newInputAddress, token);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Requires user id');
    expect(code).to.be.equal(401);
  });
});
