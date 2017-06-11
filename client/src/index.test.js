/* globals test expect jest */
import React from 'react';
// import { shallow } from 'enzyme';
// import toJson from 'enzyme-to-json';

import registerServiceWorker from './registerServiceWorker';
import './index';

// jest.mock('./registerServiceWorker', () => ({
//   register: jest.fn(),
// }));

jest.mock('./App', () => () => <div />);
jest.mock('./registerServiceWorker', () => jest.fn());

test('index smoke test', () => {
  expect(1).toBe(1);
});

test('index should register ServiceWorker', () => {
  expect(registerServiceWorker).toHaveBeenCalled();
});
