import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './schema';
import resolvers from './resolvers';

const PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;
const IP = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const server = express();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

server.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(() => ({
    schema,
    // rootValue,
    // context: context(request.headers, process.env),
  })),
);

server.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    query: `# Welcome to GraphiQL
{
  author(id:1){
    id
    firstName
  }
#  authors(limit:10,offset:5){
#    id
#    firstName
#  }
  post(id:1){
    title
    text
    votes
  }
#  posts(limit:10,offset:5){
#    id
#    title
#  }
}`,
  }),
);

server.listen(PORT, IP, () => {
  console.log(`GraphQL Server running on http://localhost:${PORT}/graphql`); // eslint-disable-line
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`); // eslint-disable-line
});
