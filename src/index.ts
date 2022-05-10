import 'reflect-metadata';
import { User } from './entity/User';
import { v4 as uuidv4 } from 'uuid';
import { ApolloServer, gql } from 'apollo-server';
import { AppDataSource } from './data-source';
import { CustomError } from './errors';
import { containLetter, containDigit, findUserEmail } from './functions';
import * as bcrypt from 'bcrypt';

const connectionDb = async () => {
  await AppDataSource.initialize();
  console.info('DB connected');
};

const addUser = async ({ id, name, email, password, birthDate }) => {
  await AppDataSource.manager.insert(User, {
    id,
    name,
    email,
    password,
    birthDate
  });
  const userCreated = {
    id,
    name,
    email,
    birthDate
  };
  return userCreated;
};

const setupServer = async () => {
  const typeDefs = gql`
    type Query {
      hello: String
    }
    type User {
      id: String
      name: String
      email: String
      password: String
      birthDate: String
    }
    type Mutation {
      createUser(
        id: String
        name: String
        email: String
        password: String
        birthDate: String
      ): User!
    }
  `;

  const resolvers = {
    Query: {
      hello: () => {
        return 'Hello world!';
      }
    },
    Mutation: {
      async createUser(parent, args) {
        const password = await bcrypt.hash(args.password, 10);
        const user = {
          id: uuidv4(),
          name: args.name,
          email: args.email,
          password: args.password,
          birthDate: args.birthDate
        };
        if (!user.name || !user.email || !user.password || !user.birthDate) {
          throw new CustomError('Please check the fields!', 422);
        }
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

        const result = await addUser(userData);
        return result;
      }
    }
  };
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

async function setup() {
  await connectionDb();
  await setupServer();
}
setup();
