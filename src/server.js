import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './schema';
import resolvers from './resolvers';

const PORT = process.env.PORT || 3010;
const IP = process.env.IP || '0.0.0.0';
const server = express();

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://kriswep.eu.auth0.com/.well-known/jwks.json',
  }),

  // Validate the audience and the issuer.
  audience: 'https://graphql.wetainment.com/api',
  issuer: 'https://kriswep.eu.auth0.com/',
  algorithms: ['RS256'],
});

const checkScopes = jwtAuthz(['api:access']);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const graphqlSchemaFac = request => ({
  schema,
  // rootValue,
  context: {
    user: 'Todo',
    headers: request.headers,
    // env: process.env,
  },
});

server.use('/', express.static('./client/build'));

server.use(
  '/graphql',
  bodyParser.json(),
  checkJwt,
  checkScopes,
  graphqlExpress(graphqlSchemaFac),
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

export default server;
