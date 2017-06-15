/* globals test expect */
import React from 'react';
import { shallow } from 'enzyme';
import Callback from './';
// import toJson from 'enzyme-to-json';

test('Callback should render loading icon', () => {
  const wrapper = shallow(<Callback />);
  expect(wrapper.find('div img').length).toBe(1);
});
