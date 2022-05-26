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
    addresses: [Address!]
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
    createAddress(data: AddressInput!): Address!
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
  type Address {
    id: String!
    cep: String!
    street: String!
    streetNumber: Int!
    complement: String!
    neighborhood: String!
    city: String!
    state: String!
  }
  input AddressInput {
    cep: String!
    street: String!
    streetNumber: Int!
    complement: String!
    neighborhood: String!
    city: String!
    state: String!
    userId: String!
  }
`;
