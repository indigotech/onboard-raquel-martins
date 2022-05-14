import { CustomError } from '../errors';
import {
  containLetter,
  containDigit,
  findUserEmail,
  addUser,
  findUserData
} from '../functions';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import { secretKey } from '../secretKey';

export const resolvers = {
  Query: {
    hello: () => {
      return 'Hello world!';
    }
  },
  Mutation: {
    async createUser(_, args) {
      const password = await bcrypt.hash(args.data.password, 10);
      const user: User = {
        ...args.data
      };
      console.log('AAA', args.data);
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
      const userData = {
        ...user,
        password
      };

      return await addUser(userData);
    },
    async login(_, args) {
      const user = await findUserData(args.data.email);
      if (!user) {
        throw new CustomError('Unable to login', 401);
      }
      const isPasswordVaid = await bcrypt.compare(
        args.data.password,
        user.password
      );
      if (!isPasswordVaid) {
        throw new CustomError('Unable to login', 401);
      }
      return {
        user,
        token: jwt.sign({ userId: user.id, email: user.email }, `${secretKey}`)
      };
    }
  }
};
