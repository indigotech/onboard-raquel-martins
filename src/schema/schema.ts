import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    user(id: String): User!
    users(quantity: Int = 10, page: Int = 1): UsersList
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
  type UsersList {
    users: [User!]
    count: Int!
    before: Int!
    after: Int!
    page: Int!
  }
`;
