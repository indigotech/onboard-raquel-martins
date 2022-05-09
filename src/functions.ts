import { AppDataSource } from './data-source';
import { User } from './entity/User';

export const containLetter = (pass: string): boolean => {
  const letters = new RegExp('[A-Za-z]');
  const password = pass;
  let findLetter = false;
  if (letters.test(password)) {
    findLetter = true;
  }
  return findLetter;
};

export const containDigit = (pass: string) => {
  const digits = new RegExp('[0-9]+');
  const password = pass;
  let findDigit = false;
  if (digits.test(password)) {
    findDigit = true;
  }
  return findDigit;
};

export const findUserEmail = async (email: string): Promise<boolean> => {
  const userEmail = email;
  const findUser = await AppDataSource.manager.findOneBy(User, {
    email: userEmail
  });
  let findEmail = false;
  if (findUser !== null) {
    findEmail = true;
  }
  return findEmail;
};
