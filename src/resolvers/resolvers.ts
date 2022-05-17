import * as bcrypt from 'bcrypt';
import { User } from '../entity/User';
import { CustomError } from '../errors';
import {
  addUser,
  containDigit,
  containLetter,
  findUserById,
  findUserData,
  findUserEmail,
  generateToken,
  toHashPassword,
  validateEmail,
  getAllUsers,
  getTotalNumbersOfUser
} from '../functions';
import { getUserIdByToken } from '../utils/get-userId-by-token';

export const resolvers = {
  Query: {
    user: async (_, args, context: { req }) => {
      const userId = getUserIdByToken(context);
      if (!userId) {
        throw new CustomError('Invalid token', 401);
      }
      const user = await findUserById(args.id);
      if (!user) {
        throw new CustomError('User not found.', 404);
      }
      return user;
    },
    users: (_, args, context: { req }) => {
      const userId = getUserIdByToken(context);
      if (!userId) {
        throw new CustomError('Invalid token', 401);
      }
      const quantity: number = args.quantity;
      const page: number = args.page;
      const users = await getAllUsers(quantity, page);
      const totalUsers = await getTotalNumbersOfUser();

      return {
        users,
        count: totalUsers,
        before:
          page === 1
            ? 0
            : quantity * (page - 1) > totalUsers
            ? 0
            : quantity * (page - 1),
        after: page * quantity > totalUsers ? 0 : totalUsers - page * quantity,
        page: page
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
    }
  }
};
