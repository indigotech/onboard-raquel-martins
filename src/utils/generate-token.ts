import * as jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ userId: id }, `${process.env.SECRET}`, {
    expiresIn: process.env.EXPIRES_IN
  });
};
