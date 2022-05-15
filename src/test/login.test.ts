import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import { secretKey } from '../secretKey';
import { queryLogin } from './queryLogin';
import { queryCreateUser } from './queryCreateUser';
import { getToken } from '../functions';

const input: User = {
  id: '1234',
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
    await AppDataSource.getRepository(User).delete({});
  });

  it('should login', async () => {
    const tokenInput: string = getToken(input);
    await queryCreateUser(input, tokenInput);
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
    expect(tokenPayload.email).to.be.equal(findUser.email);
    expect(tokenPayload.userId).to.be.equal(findUser.id);
  });

  it('should not be able to login with wrong password', async () => {
    const token: string = getToken(input);
    await queryCreateUser(input, token);
    const newLogin = { ...loginInput, password: 'alecrim1' };
    const response = await queryLogin(newLogin);
    expect(response.data.errors[0].message).to.be.equal('Unable to login');
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(401);
  });

  it('should not be able to login with email that does not exist', async () => {
    const token: string = getToken(input);
    await queryCreateUser(input, token);
    const newLogin = { ...loginInput, email: 'teste@gmail.com' };
    const response = await queryLogin(newLogin);
    expect(response.data.errors[0].message).to.be.equal('Unable to login');
    expect(response.data.errors[0].extensions.exception.code).to.be.equal(401);
  });
});
