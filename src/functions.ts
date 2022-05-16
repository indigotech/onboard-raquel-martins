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

export const addUser = async ({ name, email, password, birthDate }) => {
  return AppDataSource.manager.save(User, {
    name,
    email,
    password,
    birthDate
  });
};

export const findUserData = async (email: string) => {
  return await AppDataSource.manager.findOneBy(User, {
    email
  });
};

export const findUserById = async (id: string) => {
  return await AppDataSource.manager.findOneBy(User, {
    id
  });
};

export const generateToken = (user: User) => {
  return jwt.sign({ userId: user.id }, `${secretKey}`);
};

export const toHashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
