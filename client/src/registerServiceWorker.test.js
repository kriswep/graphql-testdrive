/* globals test expect jest Event */

import register, { unregister } from './registerServiceWorker';

// global.promiseResolver = () => null;
// global.promise = new Promise((resolve) => {
//   global.promiseResolver = resolve;
// });
// global.navigator.serviceWorker = { ready: jest.fn(() => global.promise) };

test('serviceWorker should not register in test', () => {
  expect(register).not.toThrow();
});

test('serviceWorker should register in prod', () => {
  const event = new Event('load');
  const registration = {
    register: jest.fn(),
    installing: {},
  };
  process.env.NODE_ENV = 'production';
  const registerCatch = { catch: jest.fn() };
  const registerThen = { then: jest.fn(() => registerCatch) };
  global.navigator.serviceWorker = { register: jest.fn(() => registerThen) };

  expect(register).not.toThrow();
  global.window.dispatchEvent(event);
  expect(global.navigator.serviceWorker.register).toHaveBeenCalledWith(
    '/service-worker.js',
  );
  expect(registerThen.then).toHaveBeenCalled();
  registerThen.then.mock.calls[0][0](registration);
  expect(registration.onupdatefound).not.toThrow();
  expect(registration.installing.onstatechange).not.toThrow();
  registration.installing.state = 'installed';
  expect(registration.installing.onstatechange).not.toThrow();
  global.navigator.serviceWorker.controller = true;
  expect(registration.installing.onstatechange).not.toThrow();
  // registerCatch();
  expect(registerCatch.catch).toHaveBeenCalled();
  expect(
    registerCatch.catch.mock.calls[0][0].bind(null, 'wanted mock error'),
  ).not.toThrow();

  delete global.navigator.serviceWorker;
});

test('serviceWorker should unregister', () => {
  const registration = {
    unregister: jest.fn(),
  };
  delete global.navigator.serviceWorker;

  expect(unregister).not.toThrow();
  global.navigator.serviceWorker = { ready: { then: jest.fn(() => {}) } };
  expect(unregister).not.toThrow();
  expect(global.navigator.serviceWorker.ready.then).toHaveBeenCalled();
  global.navigator.serviceWorker.ready.then.mock.calls[0][0](registration);
  expect(registration.unregister).toHaveBeenCalled();

  delete global.navigator.serviceWorker;
});
