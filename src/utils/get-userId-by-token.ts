import { CustomError } from '../errors';
import * as jwt from 'jsonwebtoken';
import { secretKey } from '../secret-key';

export const getUserId = (request) => {
  const header = request.auth;
  if (!header) {
    throw new CustomError('Authentication required', 401);
  }
  const token = header.replace('Bearer', '');

  const decoded = jwt.verify(token, `${secretKey}`);
  return decoded['userId'];
};
