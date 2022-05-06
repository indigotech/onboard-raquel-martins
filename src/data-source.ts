import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { v4 as uuidv4 } from "uuid";
import { ApolloServer, gql } from "apollo-server";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "raquelmms",
  password: "123abc",
  database: "raquelmms",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    const addUser = async ({ id, name, email, password, birthDate }) => {
      console.log("addUser:", id, name, email, password, birthDate);
      const response = await AppDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            id: id,
            name: name,
            email: email,
            password: password,
            birthDate: birthDate,
          },
        ])
        .execute();
      return response;
    };

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
          return "Hello world!";
        },
      },
      Mutation: {
        async createUser(parent, args) {
          try {
            const user = {
              id: uuidv4(),
              name: args.name,
              email: args.email,
              password: args.password,
              birthDate: args.birthDate,
            };

            if (
              !user.name ||
              !user.email ||
              !user.password ||
              !user.birthDate
            ) {
              throw new Error("Please check the fields!");
            }
            console.log("user", user);
            console.log(await addUser(user));

            return { message: "User created" };
          } catch (error: any) {
            return `message: ${error.message}`;
          }
        },
      },
    };
    const server = new ApolloServer({ typeDefs, resolvers });
    server.listen(4000).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((error) => console.log(error));
