'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlSchemaFac = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveStatic = require('serve-static');

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _graphqlServerExpress = require('graphql-server-express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _graphqlTools = require('graphql-tools');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PORT = process.env.PORT || 3010;
const IP = process.env.IP || '0.0.0.0';
const server = (0, _express2.default)();

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
// const jwtAuthz = require('express-jwt-authz');

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
    jwksUri: 'https://kriswep.eu.auth0.com/.well-known/jwks.json'
  }),

  // Validate the audience and the issuer.
  audience: 'https://graphql.wetainment.com/api',
  issuer: 'https://kriswep.eu.auth0.com/',
  algorithms: ['RS256'],
  credentialsRequired: false
});

// ignore scopes, we do that ourselves
// const checkScopes = jwtAuthz(['api:access']);

const schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: _schema2.default,
  resolvers: _resolvers2.default
});

const graphqlSchemaFac = exports.graphqlSchemaFac = request => ({
  schema,
  // rootValue,
  context: {
    user: request.user,
    headers: request.headers
  }
});

server.use('/', (0, _serveStatic2.default)(_path2.default.join(__dirname, '../client/build')));

server.use('/graphql', _bodyParser2.default.json(), checkJwt,
// checkScopes,
(0, _graphqlServerExpress.graphqlExpress)(graphqlSchemaFac));

server.use('/graphiql', (0, _graphqlServerExpress.graphiqlExpress)({
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
}`
}));

server.listen(PORT, IP, () => {
  console.log(`GraphQL Server running on http://localhost:${PORT}/graphql`); // eslint-disable-line
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`); // eslint-disable-line
});

exports.default = server;