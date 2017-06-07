'use strict';

var _connectors = require('./connectors');

require('./seed');

/* globals test expect jest */
global.createPost = jest.fn();
jest.mock('./connectors', () => ({
  db: {
    sync: jest.fn(() => Promise.resolve()),
    models: {
      author: {
        create: jest.fn(() => Promise.resolve({ createPost: global.createPost }))
      }
    }
  },
  Author: {
    create: jest.fn(() => Promise.resolve({
      createPost: global.createPost
    }))
  }
}));

test('should seed database', () => {
  expect(_connectors.db.sync).toHaveBeenCalled();
  expect(_connectors.db.models.author.create).toHaveBeenCalled();
  expect(_connectors.db.models.author.create.mock.calls.length).toBe(10);
  expect(global.createPost).toHaveBeenCalled();
  expect(global.createPost.mock.calls.length).toBe(50);
});