import { secretKey } from './secret-key';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export const containLetter = (pass: string): boolean => {
  const letters = new RegExp('[A-Za-z]');
  const password = pass;
  return letters.test(password);
};

export const containDigit = (pass: string) => {
  const digits = new RegExp('[0-9]+');
  const password = pass;
  return digits.test(password);
};

export const findUserEmail = async (email: string): Promise<boolean> => {
  const userEmail = email;
  const findUser = await AppDataSource.manager.findOneBy(User, {
    email: userEmail
  });
  return !!findUser;
};

export const addUser = (user) => {
  return AppDataSource.manager.save(User, user);
};

export const findUserData = (email: string) => {
  return AppDataSource.manager.findOneBy(User, {
    email
  });
};

export const findUserById = (id: string) => {
  return AppDataSource.manager.findOneBy(User, {
    id
  });
};

export const generateToken = (user: User) => {
  return jwt.sign({ userId: user.id }, `${secretKey}`);
};

export const toHashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const validateEmail = (email: string) => { 
  const isEmailValid = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return isEmailValid.test(email)
   
}
