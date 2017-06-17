/* globals test expect jest */
import React from 'react';
import { shallow, mount } from 'enzyme';
import Home from './';
// import toJson from 'enzyme-to-json';

test('Home should notify when logged in', () => {
  const wrapper = shallow(<Home auth={{ isAuthenticated: () => true }} />);
  expect(wrapper.find('h4').text()).toBe('You are logged in!');
});

test('Home should notify when not logged in', () => {
  const wrapper = shallow(<Home auth={{ isAuthenticated: () => false }} />);
  expect(wrapper.find('h4').text()).toBe(
    'You are not logged in! Please Log In to continue.',
  );
});

test('Home should have link to login when not logged in', () => {
  const onButtonClick = jest.fn();
  const wrapper = mount(
    <Home auth={{ isAuthenticated: () => false, login: onButtonClick }} />,
  );
  wrapper.find('a').simulate('click');
  expect(onButtonClick).toHaveBeenCalled();
});
