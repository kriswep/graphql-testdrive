/* globals test expect jest */
// import { shallow } from 'enzyme';
import { Route } from 'react-router';
import makeMainRoutes, { handleAuthentication } from './routes';
import * as Auth from './Auth';
import App from './App';
import Home from './Home';
import Callback from './Callback';

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('routes should define mainRoute', () => {
  const routes = makeMainRoutes();
  expect(routes).toMatchSnapshot();
});

test('routes should handle auth', () => {
  // without auth
  expect(
    handleAuthentication.bind(null, {}, { location: { hash: '' } }),
  ).not.toThrow();

  // with auth
  const mMock = jest.fn();
  expect(
    handleAuthentication.bind(
      null,
      { handleAuthentication: mMock },
      { location: { hash: 'access_token' } },
    ),
  ).not.toThrow();
  expect(mMock).toHaveBeenCalled();
});

test('renders correct routes', () => {
  Auth.default = jest.fn();

  const routes = makeMainRoutes();

  const wrapper = shallow(routes);
  const routesRender = wrapper.find(Route).reduce((prev, route) => {
    const routeProps = route.props();
    // eslint-disable-next-line no-param-reassign
    prev[routeProps.path] = routeProps.render;
    return prev;
  }, {});
  // { 'nurse/authorization' : NurseAuthorization, ... }
  expect(typeof routesRender['/']).toBe('function');
  expect(typeof routesRender['/home']).toBe('function');
  expect(typeof routesRender['/callback']).toBe('function');

  expect(routesRender['/']().type).toEqual(App);
  expect(routesRender['/home']().type).toEqual(Home);
  expect(routesRender['/callback']({ location: { hash: '' } }).type).toEqual(
    Callback,
  );
});
