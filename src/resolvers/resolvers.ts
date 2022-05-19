import * as bcrypt from 'bcrypt';
import { User } from '../entity/user';
import { CustomError } from '../errors';
import {
  addUser,
  containDigit,
  containLetter,
  findUserData,
  findUserEmail,
  validateEmail,
  getCountUsers,
  addAddress,
  toHashPassword,
  getUsers,
  getUserById
} from '../functions';
import { getUserIdByToken } from '../utils/get-userId-by-token';
import { Address } from '../entity/address';
import { generateToken } from '../utils/generate-token';

export const resolvers = {
  Query: {
    user: async (_, args, context: { req }) => {
      const userId = getUserIdByToken(context);
      if (!userId) {
        throw new CustomError('Invalid token', 401);
      }
      const user = await getUserById(args.id);
      if (!user) {
        throw new CustomError('User not found.', 404);
      }
      return user;
    },
    users: async (_, args, context: { req }) => {
      const userId = getUserIdByToken(context);
      if (!userId) {
        throw new CustomError('Invalid token', 401);
      }
      const quantity: number = args.quantity;
      const page: number = args.page;
      const users = await getUsers(quantity, page);
      const totalUsers = await getCountUsers();

      return {
        users: users,
        count: totalUsers,
        before:
          quantity * (page - 1) > totalUsers
            ? totalUsers
            : quantity * (page - 1),
        after: page * quantity > totalUsers ? 0 : totalUsers - page * quantity,
        page
      };
    }
  },
  Mutation: {
    async createUser(_, args, context: { req }) {
      const userId = getUserIdByToken(context);
      if (!userId) {
        throw new CustomError('Invalid token', 401);
      }
      const password = await toHashPassword(args.data.password);
      const user: User = {
        ...args.data
      };
      if (user.password.length < 6) {
        throw new CustomError(
          'Password must contain at least 6 characters',
          400
        );
      }

      if (!containLetter(user.password)) {
        throw new CustomError(
          'The password must contain at least 1 letter',
          400
        );
      }

      if (!containDigit(user.password)) {
        throw new CustomError(
          'The password must contain at least 1 digit',
          400
        );
      }

      if (await findUserEmail(user.email)) {
        throw new CustomError('Email already registered', 409);
      }
      const userData: User = {
        ...user,
        password
      };

      if (!validateEmail(user.email)) {
        throw new CustomError('Invalid email format', 400);
      }

      return addUser(userData);
    },
    async login(_, args) {
      const user = await findUserData(args.data.email);
      if (!user) {
        throw new CustomError('Unregistered user email', 401);
      }
      const isPasswordValid = await bcrypt.compare(
        args.data.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new CustomError('Password incorrect', 401);
      }
      return {
        user,
        token: generateToken(user)
      };
    },
    async createAddress(_, args, context: { req }) {
      const userId = getUserIdByToken(context);
      if (!userId) {
        throw new CustomError('Invalid token', 401);
      }
      const address: Address = args.data;
      return addAddress(address);
    }
  }
};
