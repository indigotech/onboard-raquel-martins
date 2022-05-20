import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import { queryLogin } from './query-login';
import { addUser, toHashPassword } from '../functions';
import { input, loginInput } from './constants';

describe('Login Mutation', async () => {
  beforeEach(async () => {
    AppDataSource.getRepository(User);
    const userOne = {
      ...input,
      password: await toHashPassword(input.password)
    };
    await addUser(userOne);
  });

  afterEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  it('should login', async () => {
    const findUser = await AppDataSource.manager.findOneBy(User, {
      email: loginInput.email
    });
    const response = await queryLogin(loginInput);
    const user = response.data.data.login.user;
    delete findUser.password;
    delete user.password;
    const token = response.data.data.login.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    const tokenPayload = decoded as jwt.JwtPayload;
    expect(user).to.be.deep.equal(findUser);
    expect(tokenPayload.userId).to.be.equal(findUser.id);
  });

  it('should not be able to login with wrong password', async () => {
    const newLogin = { ...loginInput, password: 'alecrim1' };
    const response = await queryLogin(newLogin);
    expect(response.data.errors[0].message).to.be.equal('Password incorrect');
    expect(response.data.errors[0].code).to.be.equal(401);
  });

  it('should not be able to login with email that does not exist', async () => {
    const newLogin = { ...loginInput, email: 'random@gmail.com' };
    const response = await queryLogin(newLogin);
    expect(response.data.errors[0].message).to.be.equal(
      'Unregistered user email'
    );
    expect(response.data.errors[0].code).to.be.equal(401);
  });
});
