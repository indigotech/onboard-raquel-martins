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
    user = await addUser(inputCreateUserOne);
  });

  afterEach(async () => {
    await AppDataSource.getRepository(Address).delete({});
    await AppDataSource.getRepository(User).delete({});
  });

  it.only('should create a address', async () => {
    const newInputAddress = {
      ...inputAddress,
      user: user.id
    };

    const response = await queryCreateAddress(newInputAddress, token);
    const addressResponse = response.data.data.createAddress;
    const findAddress = await AppDataSource.manager.find(Address);
    delete findAddress[0].id;
    delete newInputAddress.user;
    delete addressResponse.id;
    expect(newInputAddress).to.be.deep.equal(findAddress[0]);
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
    expect(message).to.be.equal('Id not found');
    expect(code).to.be.equal(404);
  });
});
