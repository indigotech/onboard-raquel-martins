import { AppDataSource } from './data-source';
import { User } from './entity/user';
import * as bcrypt from 'bcrypt';
import { Address } from './entity/address';

//Regex
const lettersRegex = new RegExp('[A-Za-z]');

const digitsRegex = new RegExp('[0-9]+');

const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

export const containLetter = (pass: string): boolean => {
  return lettersRegex.test(pass);
};

export const containDigit = (pass: string) => {
  return digitsRegex.test(pass);
};

export const validateEmail = (email: string) => {
  return emailRegex.test(email);
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

export const toHashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const addAddress = async (address) => {
  return AppDataSource.manager.save(Address, address);
};

export const getUserById = (id) => {
  return AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.addresses', 'address')
    .where('user.id = :id', { id })
    .getOne();
};

export const getUsers = (quantity: number, page: number) => {
  return AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.addresses', 'address')
    .orderBy('user.name', 'ASC')
    .take(quantity)
    .skip(quantity * (page - 1))
    .getMany();
};

export const getCountUsers = () => {
  return AppDataSource.manager.count(User);
};
