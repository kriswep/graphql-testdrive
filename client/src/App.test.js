/* globals test expect jest document */
import React from 'react';
// import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import App, { addAuthHeader } from './App';

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('./PostList', () => () => <div />);
jest.mock(
  './schema',
  () => `
  type Mock {
    id: Int!
  }
  type Query {
    mock: Mock
  }`,
);

test('App renders without crashing', () => {
  const auth = { isAuthenticated: () => true };
  const authWrapper = shallow(<App auth={auth} />);
  expect(toJson(authWrapper)).toMatchSnapshot();

  const notAuth = { isAuthenticated: () => false };
  const notAuthWrapper = shallow(<App auth={notAuth} />);
  expect(toJson(notAuthWrapper)).toMatchSnapshot();
});

test('App should have expected properties', () => {
  const props = {
    history: { replace: jest.fn() },
    auth: { login: jest.fn(), logout: jest.fn() },
  };
  const app = new App(props);
  expect(app.goTo).toBeDefined();
  expect(app.login).toBeDefined();
  expect(app.logout).toBeDefined();

  expect(app.goTo.bind(app, 'route')).not.toThrow();
  expect(props.history.replace).toHaveBeenCalledWith('/route');

  expect(app.login.bind(app)).not.toThrow();
  expect(props.auth.login).toHaveBeenCalled();

  expect(app.logout.bind(app)).not.toThrow();
  expect(props.auth.logout).toHaveBeenCalled();
});

test('App should add auth header', () => {
  const nextMock = jest.fn();
  const notAuthProps = {
    auth: { isAuthenticated: () => false },
  };
  expect(
    addAuthHeader(notAuthProps).applyMiddleware.bind(null, null, nextMock),
  ).not.toThrow();
  expect(nextMock).toHaveBeenCalled();
  nextMock.mockReset();

  const accessTokenMock = jest
    .fn(() => 'accessToken')
    .mockImplementationOnce(() => false);
  const authProps = {
    auth: { isAuthenticated: () => true, getAccessToken: accessTokenMock },
  };
  const headersReq = { options: { headers: {} } };
  expect(
    addAuthHeader(authProps).applyMiddleware.bind(null, headersReq, nextMock),
  ).not.toThrow();
  expect(headersReq.options.headers).toEqual({ authorization: null });
  expect(nextMock).toHaveBeenCalled();
  nextMock.mockReset();

  const noHeadersReq = { options: { headers: false } };
  expect(
    addAuthHeader(authProps).applyMiddleware.bind(null, noHeadersReq, nextMock),
  ).not.toThrow();
  expect(noHeadersReq.options.headers).toEqual({
    authorization: 'Bearer accessToken',
  });
  expect(nextMock).toHaveBeenCalled();
  nextMock.mockReset();
});
