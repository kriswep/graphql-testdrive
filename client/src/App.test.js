/* globals test expect jest document */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

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
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  expect(1).toBe(1);
});
