import 'reflect-metadata';
import { User } from '../entity/User';
import { ApolloServer, gql } from 'apollo-server';
import { AppDataSource } from './data-source';
import { CustomError } from '../errors';
import { containLetter, containDigit, findUserEmail } from './functions';
import * as bcrypt from 'bcrypt';

const connectionDb = async () => {
  await AppDataSource.initialize();
  console.info('DB connected');
};

export const addUser = ({ name, email, password, birthDate }) => {
  return AppDataSource.manager.save(User, {
    name,
    email,
    password,
    birthDate
  });
};

const setupServer = async () => {
  const typeDefs = gql`
    type Query {
      hello: String
    }
    type User {
      id: String!
      name: String!
      email: String!
      birthDate: String
    }
    input UserInput {
      name: String!
      email: String!
      password: String!
      birthDate: String
    }
    type Mutation {
      createUser(data: UserInput!): User!
    }
  `;

  const resolvers = {
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
        if (user.password.length < 6) {
          throw new CustomError(
            'Password must contain at least 6 characters',
            422
          );
        }

        if (!containLetter(user.password)) {
          throw new CustomError(
            'The password must contain at least 1 letter',
            422
          );
        }

        if (!containDigit(user.password)) {
          throw new CustomError(
            'The password must contain at least 1 digit',
            422
          );
        }

        if (await findUserEmail(user.email)) {
          throw new CustomError('Email already registered', 409);
        }
        const userData = {
          ...user,
          password
        };

        return addUser(userData);
      }
    }
  };
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen(4001).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

export async function setup() {
  await connectionDb();
  await setupServer();
}
