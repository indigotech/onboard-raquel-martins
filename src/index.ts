import { ApolloServer, gql } from 'apollo-server';
import { User } from './entity/User';
import { v4 as uuidv4 } from 'uuid';

//Data store mock
const users = [
  {
    id: '123',
    name: 'Robert',
    email: 'robert@email.com',
    password: 'crespusculo',
    birthDate: '10-12-1986'
  },
  {
    id: '321',
    name: 'Kristen',
    email: 'kristen@email.com',
    password: 'crespusculo',
    birthDate: '10-10-1985'
  }
];

//Type definition (schema)
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
      name: String!
      email: String!
      password: String!
      birthDate: String!
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
    createUser(parent, args, ctx, info) {
      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        password: args.password,
        birthDate: args.birthDate
      };

      users.push(user);
      return user;
    }
  }
};
