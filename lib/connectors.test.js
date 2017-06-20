'use strict';

var _connectors = require('./connectors');

var _db = require('./db');

/* globals test expect jest */
global.promiseResolver = () => null;
global.promise = new Promise(resolve => {
  global.promiseResolver = resolve;
});
jest.mock('./db', () => ({
  AuthorDb: {
    find: jest.fn(),
    findAll: jest.fn()
  },
  PostDb: {
    find: jest.fn(() => global.promise),
    findAll: jest.fn()
  }
}));

test('connectors should define Author and Post', () => {
  expect(_connectors.Author).toBeDefined();
  expect(_connectors.Post).toBeDefined();
});

test('author findSub should find from db model', () => {
  const expected = 1;
  expect(_connectors.Author.findSub.bind(null, expected)).not.toThrow();
  expect(_db.AuthorDb.find).toHaveBeenCalledWith({ where: { sub: expected } });
  _db.AuthorDb.find.mockClear();
});

test('author find should find from db model', () => {
  const expected = 1;
  expect(_connectors.Author.find.bind(null, expected)).not.toThrow();
  expect(_db.AuthorDb.find).toHaveBeenCalledWith({ where: { id: expected } });
  _db.AuthorDb.find.mockClear();
});

test('author findAll should not throw', () => {
  const expected = { limit: 1, offset: 2, where: { id: 1 } };
  expect(_connectors.Author.findAll.bind(null, expected.limit, expected.offset, expected.where)).not.toThrow();
  expect(_db.AuthorDb.findAll).toHaveBeenCalledWith(expected);
  _db.AuthorDb.findAll.mockClear();
});

test('author getPosts should get Posts', () => {
  const author = { getPosts: jest.fn(() => true) };
  expect(_connectors.Author.getPosts(author)).toBeTruthy();
  expect(author.getPosts).toHaveBeenCalled();
});

test('post find should not throw', () => {
  const expected = 1;
  expect(_connectors.Post.find.bind(null, expected)).not.toThrow();
  expect(_db.PostDb.find).toHaveBeenCalledWith({ where: { id: expected } });
  _db.PostDb.find.mockClear();
});

test('post findAll should not throw', () => {
  const expected = { limit: 1, offset: 2, where: { id: 1 } };
  expect(_connectors.Post.findAll.bind(null, expected.limit, expected.offset, expected.where)).not.toThrow();
  expect(_db.PostDb.findAll).toHaveBeenCalledWith(expected);
  _db.PostDb.findAll.mockClear();
});

test('post getAuthor should get Author', () => {
  const post = { getAuthor: jest.fn(() => true) };
  expect(_connectors.Post.getAuthor(post)).toBeTruthy();
  expect(post.getAuthor).toHaveBeenCalled();
});

test('post upvotePost should not throw', () => {
  const expected = 2;
  expect(_connectors.Post.upvotePost.bind(null, expected)).not.toThrow();
  expect(_db.PostDb.find).toHaveBeenCalledWith({ where: { id: expected } });

  _db.PostDb.find.mockClear();

  const postUpdate = jest.fn(args => {
    expect(args).toEqual({ votes: 3 });
    return Promise.resolve();
  });
  global.promiseResolver({
    votes: 2,
    update: postUpdate
  });

  _db.PostDb.find.mockClear();
});