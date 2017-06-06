/* globals test expect jest */
import server, { graphqlSchemaFac } from './server';

jest.mock('graphql-tools', () => ({
  makeExecutableSchema: jest.fn(() => ({ mock: 'schema' })),
}));

test('server should use graphql', () => {
  expect(server.use).toHaveBeenCalled();
  expect(server.use.mock.calls[0]).toMatchSnapshot();
});

test('server should use graphiql', () => {
  expect(server.use).toHaveBeenCalled();
  expect(server.use.mock.calls[1]).toMatchSnapshot();
});

test('server should listen', () => {
  expect(server.listen).toHaveBeenCalled();
});

test('graphqlSchemaFactory should return GraphQLOptions with schema', () => {
  const expected = {
    schema: {
      mock: 'schema',
    },
  };
  expect(graphqlSchemaFac()).toEqual(expected);
});
