import { CustomError } from '../errors';
import * as jwt from 'jsonwebtoken';
import { secretKey } from '../secret-key';

export const getUserIdByToken = (context) => {
  const authenticationToken = context.auth;
  if (!authenticationToken) {
    throw new CustomError('Authentication required', 401);
  }
  const token = authenticationToken.replace('Bearer', '');

  const decoded = jwt.verify(token, `${secretKey}`);
  return decoded['userId'];
};
