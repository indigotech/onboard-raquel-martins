import 'reflect-metadata';
import { User } from './entity/User';
import { v4 as uuidv4 } from 'uuid';
import { ApolloServer, gql } from 'apollo-server';
import { AppDataSource } from './data-source';

const connectionDb = async () => {
  await AppDataSource.initialize();
  console.info('DB connected');
};

const addUser = async ({ id, name, email, password, birthDate }) => {
  const response = await AppDataSource.manager.insert(User, {
    id,
    name,
    email,
    password,
    birthDate
  });
  return response;
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
        try {
          const user = {
            id: uuidv4(),
            name: args.name,
            email: args.email,
            password: args.password,
            birthDate: args.birthDate
          };

          if (!user.name || !user.email || !user.password || !user.birthDate) {
            throw new Error('Please check the fields!');
          }
          const result = await addUser(user);
          return result;
        } catch (error: any) {
          return `message: ${error.message}`;
        }
      }
    }
  };
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

async function setup() {
  await connectionDb();
  await setupServer();
}
setup();
