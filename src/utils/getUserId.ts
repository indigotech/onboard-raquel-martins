import * as jwt from 'jsonwebtoken';
import { secretKey } from '../secretKey';

export const getUserId = (request) => {
  const header = request.request.headers.authorization;

  if (!header) {
    throw new Error('Authentication required');
  }

  const token = header.replace('Bearer ', '');
  const decoded = jwt.verify(token, `${secretKey}`);

  return decoded;
};
