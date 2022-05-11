import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import { AppDataSource } from '../data-source';

const connectionDb = async () => {
  await AppDataSource.initialize();
  console.info('DB connected');
};

const setupServer = async () => {
  const typeDefs = gql`
    type Query {
      hello: String
    }
  `;

  const resolvers = {
    Query: {
      hello: () => {
        return 'Hello world!';
      }
    }
  };
  const server = new ApolloServer({ typeDefs, resolvers });
  server
    .listen(process.env.PORT)
    .then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    })
    .catch((error) => console.error(error));
};

export async function setup() {
  await connectionDb();
  await setupServer();
}
