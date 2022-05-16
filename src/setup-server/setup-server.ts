import { ApolloServer } from 'apollo-server';
import { typeDefs } from '../schema/schema';
import { resolvers } from '../resolvers/resolvers';

export const setupServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = req.headers.authorization || '';
      return {
        auth
      };
    }
  });

  const { url } = await server.listen(process.env.PORT);
  console.log(`🚀  Server ready at ${url}`);
};
