/* globals test expect */
import server from './server';

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
