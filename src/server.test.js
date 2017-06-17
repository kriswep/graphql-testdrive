/* globals test expect jest */
import server, { graphqlSchemaFac } from './server';

jest.mock('graphql-tools', () => ({
  makeExecutableSchema: jest.fn(() => ({ mock: 'schema' })),
}));

test('server should serve static files', () => {
  expect(server.use).toHaveBeenCalled();
  expect(server.use.mock.calls[0]).toMatchSnapshot();
});

test('server should use graphql', () => {
  expect(server.use).toHaveBeenCalled();
  expect(server.use.mock.calls[1]).toMatchSnapshot();
});

test('server should use graphiql', () => {
  expect(server.use).toHaveBeenCalled();
  expect(server.use.mock.calls[2]).toMatchSnapshot();
});

test('server should listen', () => {
  expect(server.listen).toHaveBeenCalled();
});

test('graphqlSchemaFactory should return GraphQLOptions with schema', () => {
  const expected = {
    context: { headers: 'mockHeaders', user: 'Todo' },
    schema: { mock: 'schema' },
  };
  expect(graphqlSchemaFac({ headers: 'mockHeaders' })).toEqual(expected);
});
