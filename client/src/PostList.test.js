/* globals test expect */
import React from 'react';
// import { shallow } from 'enzyme';
// import toJson from 'enzyme-to-json';

import PostList from './PostList';

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('PostList should render loading message', () => {
  const wrapper = shallow(
    <PostList
      data={{
        loading: true,
      }}
    />,
  );
  expect(wrapper.find('p').text()).toBe('Loading ...');
});

test('PostList should render error message', () => {
  const wrapper = shallow(
    <PostList
      data={{
        error: {
          message: 'test error',
        },
      }}
    />,
  );
  expect(wrapper.find('p').text()).toBe('test error');
});

test('PostList should render posts', () => {
  const wrapper = shallow(
    <PostList
      data={{
        posts: [
          { id: 1, title: 'title1', text: 'Text 1', votes: 1 },
          { id: 2, title: 'title2', text: 'Text 2', votes: 2 },
        ],
      }}
    />,
  );
  expect(
    wrapper
      .find('header h1')
      .first()
      .text(),
  ).toBe('title1 (1)');
  expect(
    wrapper
      .find('section')
      .first()
      .text(),
  ).toBe('Text 1');
  expect(
    wrapper
      .find('header h1')
      .at(1)
      .text(),
  ).toBe('title2 (2)');
  expect(
    wrapper
      .find('section')
      .at(1)
      .text(),
  ).toBe('Text 2');
});
