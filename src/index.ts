import { ApolloServer, gql } from 'apollo-server';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { v4 as uuidv4 } from 'uuid';

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...');
    const user = new User();
    user.name = 'Timber';
    user.email = 'timber@email.com';
    user.password = '123456';
    user.birthDate = '01-01-1990';
    await AppDataSource.manager.save(user);
    console.log('Saved a new user');
    console.log('Loading users from the database...');
    const users = await AppDataSource.manager.find(User);
    console.log('Loaded users: ', users);

    console.log(
      'Here you can setup and run express / fastify / any other framework.'
    );
  })
  .catch((error) => console.log(error));

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

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
