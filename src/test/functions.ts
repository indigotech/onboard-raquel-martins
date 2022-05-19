import { newUser } from '../utils/data-generate-users';
import { generateToken } from '../utils/generate-token';
import { invalidId } from './constants/invalid-id';

export const generateFakeToken = async () => {
  const randomUser = await newUser();

  return generateToken({ ...randomUser, id: invalidId });
};
