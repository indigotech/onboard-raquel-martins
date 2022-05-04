import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return 'Hello world!';
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });


server.listen(4000).then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
