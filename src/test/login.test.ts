import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import { secretKey } from '../secret-key';
import { queryLogin } from './query-login';
import { addUser, toHashPassword } from '../functions';

const input = {
  name: 'UserTeste2',
  email: 'userteste2@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};

const loginInput = {
  email: 'userteste2@email.com',
  password: '1234abc'
};

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
    const decoded = jwt.verify(token, `${secretKey}`);
    const tokenPayload = decoded as jwt.JwtPayload;
    expect(user).to.be.deep.equal(findUser);
    expect(tokenPayload.userId).to.be.equal(findUser.id);
  });

  it('should not be able to login with wrong password', async () => {
    const newLogin = { ...loginInput, password: 'alecrim1' };
    const response = await queryLogin(newLogin);
    expect(response.data.errors[0].message).to.be.equal('Unable to login');
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(401);
  });

  it('should not be able to login with email that does not exist', async () => {
    const newLogin = { ...loginInput, email: 'teste@gmail.com' };
    const response = await queryLogin(newLogin);
    expect(response.data.errors[0].message).to.be.equal('Unable to login');
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(401);
  });
});
