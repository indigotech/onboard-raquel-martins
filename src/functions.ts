import { AppDataSource } from './data-source';
import { User } from './entity/User';

export const containLetter = (pass: string): boolean => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const password = pass;
  let findLetter = false;
  for (let i = 0; i < password.length; i++) {
    for (let j = 0; j < letters.length; j++) {
      if (password[i].toLowerCase().includes(letters[j])) {
        findLetter = true;
      }
    }
  }
  return findLetter;
};

export const containDigit = (pass: string) => {
  const digits = '0123456789';
  const password = pass;
  let findDigit = false;
  for (let i = 0; i < password.length; i++) {
    for (let j = 0; j < digits.length; j++) {
      if (password[i].toLowerCase().includes(digits[j])) {
        findDigit = true;
      }
    }
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
