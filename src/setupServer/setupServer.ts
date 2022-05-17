import { ApolloServer } from 'apollo-server';
import { typeDefs } from '../schema/schema';
import { resolvers } from '../resolvers/resolvers';

export const setupServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await server.listen(process.env.PORT);
  console.log(`🚀  Server ready at ${url}`);
};
