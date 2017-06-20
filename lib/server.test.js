'use strict';

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('graphql-tools', () => ({
  makeExecutableSchema: jest.fn(() => ({ mock: 'schema' }))
})); /* globals test expect jest */


test('server should serve static files', () => {
  expect(_server2.default.use).toHaveBeenCalled();
  expect(_server2.default.use.mock.calls[0]).toMatchSnapshot();
});

test('server should use graphql', () => {
  expect(_server2.default.use).toHaveBeenCalled();
  expect(_server2.default.use.mock.calls[1]).toMatchSnapshot();
});

test('server should use graphiql', () => {
  expect(_server2.default.use).toHaveBeenCalled();
  expect(_server2.default.use.mock.calls[2]).toMatchSnapshot();
});

test('server should listen', () => {
  expect(_server2.default.listen).toHaveBeenCalled();
});

test('graphqlSchemaFactory should return GraphQLOptions with schema', () => {
  const expected = {
    context: { headers: 'mockHeaders', user: undefined },
    schema: { mock: 'schema' }
  };
  expect((0, _server.graphqlSchemaFac)({ headers: 'mockHeaders' })).toEqual(expected);
});