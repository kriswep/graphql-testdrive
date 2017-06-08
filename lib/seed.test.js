'use strict';

var _db = require('./db');

require('./seed');

/* globals test expect jest */
global.createPost = jest.fn();
jest.mock('./db', () => ({
  db: {
    sync: jest.fn(() => Promise.resolve())
  },
  AuthorDb: {
    create: jest.fn(() => Promise.resolve({
      createPost: global.createPost
    }))
  }
}));

test('should seed database', () => {
  expect(_db.db.sync).toHaveBeenCalled();
  expect(_db.AuthorDb.create).toHaveBeenCalled();
  expect(_db.AuthorDb.create.mock.calls.length).toBe(10);
  expect(global.createPost).toHaveBeenCalled();
  expect(global.createPost.mock.calls.length).toBe(50);
});