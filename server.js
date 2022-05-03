const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

const app = express();

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'Hello, world!';
  },
};

app.use(
  '/graphql',
  expressGraphQL({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
