import 'reflect-metadata';
import { User } from './entity/User';
import { ApolloServer, gql } from 'apollo-server';
import { AppDataSource } from './data-source';
import { CustomError } from './errors';
import { containLetter, containDigit, findUserEmail } from './functions';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { secretKey } from 'secretKey';

const connectToDB = async () => {
  await AppDataSource.initialize();
  console.info('DB connected');
};

const addUser = async ({ name, email, password, birthDate }) => {
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
      password: String!
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
      login(data: LoginInput!): Auth!
    }
    input LoginInput {
      email: String!
      password: String!
    }
    type Auth {
      user: User!
      token: String
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

        const result = await addUser(userData);
        return result;
      },
      async login(_, args) {
        const user = await AppDataSource.manager.findOneBy(User, {
          email: args.data.email
        });
        if (!user) {
          throw new CustomError('Unable to login', 404);
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
          token: jwt.sign({ userId: user.id, email: user.email }, secretKey)
        };
      }
    }
  };
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await server.listen(process.env.PORT);

  console.log(`🚀  Server ready at ${url}`);
};

export async function setup() {
  await connectToDB();
  await setupServer();
}
setup();
