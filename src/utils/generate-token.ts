import { User } from '../entity/user';
import * as jwt from 'jsonwebtoken';

export const generateToken = (user: User) => {
  return jwt.sign({ userId: user.id }, `${process.env.SECRET}`, {
    expiresIn: process.env.EXPIRES_IN
  });
};
