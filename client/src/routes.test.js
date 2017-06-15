/* globals test expect jest */
import makeMainRoutes, { handleAuthentication } from './routes';

// let Auth = require('./Auth');
// Auth = jest.fn();
// const mMock = jest.fn();
// Auth.mockImplementation(() => ({
//   handleAuthentication: mMock,
// }));

test('routes should define mainRoute', () => {
  const routes = makeMainRoutes();
  expect(routes).toMatchSnapshot();
});

test('routes should handle auth', () => {
  // without auth
  expect(
    handleAuthentication.bind(null, { location: { hash: '' } }),
  ).not.toThrow();

  // with auth
  expect(
    handleAuthentication.bind(null, { location: { hash: 'access_token' } }),
  ).not.toThrow();
  // expect(mMock).toHaveBeenCalled();
});
