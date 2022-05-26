import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import * as jwt from 'jsonwebtoken';
import { queryLogin } from './query-login';
import { toHashPassword } from '../functions';
import { inputCreateUserOne, loginInput } from './constants';

describe('Login Mutation', async () => {
  beforeEach(async () => {
    const userOne = {
      ...inputCreateUserOne,
      password: await toHashPassword(inputCreateUserOne.password)
    };
    await AppDataSource.getRepository(User).save(userOne);
  });

  afterEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  it('should login', async () => {
    const response = await queryLogin(loginInput);
    const token = response.data.data.login.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    const tokenPayload = decoded as jwt.JwtPayload;
    const findUser = await AppDataSource.manager.findOneBy(User, {
      email: loginInput.email
    });

    delete findUser.password;
    const findUseId = findUser.id;
    const user = response.data.data.login.user;
    const tokenDecodedId = tokenPayload.userId.id;

    expect(user).to.be.deep.equal(findUser);
    expect(user.id).to.be.equal(findUseId);
    expect(user.id).to.be.equal(tokenDecodedId);
  });

  it('should not be able to login with wrong password', async () => {
    const newLogin = { ...loginInput, password: 'alecrim1' };
    const response = await queryLogin(newLogin);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Password incorrect');
    expect(code).to.be.equal(401);
  });

  it('should not be able to login with email that does not exist', async () => {
    const newLogin = { ...loginInput, email: 'random@gmail.com' };
    const response = await queryLogin(newLogin);
    const { code, message } = response.data.errors[0];
    expect(message).to.be.equal('Unregistered user email');
    expect(code).to.be.equal(401);
  });
});
