/* globals test expect jest */
import auth0 from 'auth0-js';
import Auth from './';
import history from '../history';

jest.mock('auth0-js', () => ({
  WebAuth: jest.fn(() => ({
    authorize: jest.fn(),
    parseHash: jest.fn(),
  })),
}));

jest.mock('../history', () => ({
  replace: jest.fn(),
}));

global.localStorage = {
  setItem: jest.fn(),
  getItem: jest
    .fn(() => 0)
    .mockImplementationOnce(() => new Date().getTime() + 1000),
  removeItem: jest.fn(),
};

test('auth should have its expected properties', () => {
  const auth = new Auth();

  expect(auth0.WebAuth).toHaveBeenCalled();

  expect(auth.auth0).toBeDefined();
  expect(auth.login).toBeDefined();
  expect(auth.handleAuthentication).toBeDefined();
  expect(auth.setSession).toBeDefined();
  expect(auth.logout).toBeDefined();
  expect(auth.isAuthenticated).toBeDefined();
});

test('auth login should authorize', () => {
  const auth = new Auth();

  expect(auth.login).not.toThrow();
  expect(auth.auth0.authorize).toHaveBeenCalled();
});

test('auth should handle authentication and call setSession', () => {
  const auth = new Auth();

  expect(auth.handleAuthentication).not.toThrow();
  expect(auth.auth0.parseHash).toHaveBeenCalled();

  // call without params
  expect(auth.auth0.parseHash.mock.calls[0][0].bind(auth)).not.toThrow();

  // call with error
  expect(
    auth.auth0.parseHash.mock.calls[0][0].bind(auth, 'wanted error'),
  ).not.toThrow();
  expect(history.replace).toHaveBeenCalledWith('/home');
  history.replace.mockReset();

  // call with authResult
  expect(
    auth.auth0.parseHash.mock.calls[0][0].bind(auth, '', {
      accessToken: 'accessToken',
      idToken: 'idToken',
      expiresIn: new Date().getTime() + 100,
    }),
  ).not.toThrow();
  expect(global.localStorage.setItem).toHaveBeenCalledTimes(3);
  expect(global.localStorage.setItem.mock.calls[0]).toEqual([
    'access_token',
    'accessToken',
  ]);
  expect(global.localStorage.setItem.mock.calls[1]).toEqual([
    'id_token',
    'idToken',
  ]);
  // ignore expires_at call to not mock Date
  // expect(global.localStorage.setItem.mock.calls[2]).toEqual([
  //   'expires_at',
  //   new Date().getTime(),
  // ]);
  expect(history.replace).toHaveBeenCalledWith('/home');
  history.replace.mockReset();
});

test('auth logout should remove token from localStorage', () => {
  const auth = new Auth();

  expect(auth.logout).not.toThrow();
  expect(global.localStorage.removeItem).toHaveBeenCalledTimes(3);
  expect(global.localStorage.removeItem.mock.calls[0]).toEqual([
    'access_token',
  ]);
  expect(global.localStorage.removeItem.mock.calls[1]).toEqual(['id_token']);
  expect(global.localStorage.removeItem.mock.calls[2]).toEqual(['expires_at']);

  expect(history.replace).toHaveBeenCalledWith('/home');
  history.replace.mockReset();
});

test('auth should check if its authenticated', () => {
  const auth = new Auth();

  expect(auth.isAuthenticated()).toBeTruthy();
  expect(auth.isAuthenticated()).toBeFalsy();
});
