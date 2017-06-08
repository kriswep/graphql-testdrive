/* globals test expect jest */
import { Author, Post } from './connectors';
import { AuthorDb, PostDb } from './db';

global.promiseResolver = () => null;
global.promise = new Promise((resolve) => {
  global.promiseResolver = resolve;
});
jest.mock('./db', () => ({
  AuthorDb: {
    find: jest.fn(),
    findAll: jest.fn(),
  },
  PostDb: {
    find: jest.fn(() => global.promise),
    findAll: jest.fn(),
  },
}));

test('connectors should define Author and Post', () => {
  expect(Author).toBeDefined();
  expect(Post).toBeDefined();
});

test('author find should find from db model', () => {
  const expected = 1;
  expect(Author.find.bind(null, expected)).not.toThrow();
  expect(AuthorDb.find).toHaveBeenCalledWith({ where: { id: expected } });
  AuthorDb.find.mockClear();
});

test('author findAll should not throw', () => {
  const expected = { limit: 1, offset: 2, where: { id: 1 } };
  expect(
    Author.findAll.bind(null, expected.limit, expected.offset, expected.where),
  ).not.toThrow();
  expect(AuthorDb.findAll).toHaveBeenCalledWith(expected);
  AuthorDb.findAll.mockClear();
});

test('author getPosts should get Posts', () => {
  const author = { getPosts: jest.fn(() => true) };
  expect(Author.getPosts(author)).toBeTruthy();
  expect(author.getPosts).toHaveBeenCalled();
});

test('post find should not throw', () => {
  const expected = 1;
  expect(Post.find.bind(null, expected)).not.toThrow();
  expect(PostDb.find).toHaveBeenCalledWith({ where: { id: expected } });
  PostDb.find.mockClear();
});

test('post findAll should not throw', () => {
  const expected = { limit: 1, offset: 2, where: { id: 1 } };
  expect(
    Post.findAll.bind(null, expected.limit, expected.offset, expected.where),
  ).not.toThrow();
  expect(PostDb.findAll).toHaveBeenCalledWith(expected);
  PostDb.findAll.mockClear();
});

test('post getAuthor should get Author', () => {
  const post = { getAuthor: jest.fn(() => true) };
  expect(Post.getAuthor(post)).toBeTruthy();
  expect(post.getAuthor).toHaveBeenCalled();
});

test('post upvotePost should not throw', () => {
  const expected = 2;
  expect(Post.upvotePost.bind(null, expected)).not.toThrow();
  expect(PostDb.find).toHaveBeenCalledWith({ where: { id: expected } });

  PostDb.find.mockClear();

  const postUpdate = jest.fn((args) => {
    expect(args).toEqual({ votes: 3 });
    return Promise.resolve();
  });
  global.promiseResolver({
    votes: 2,
    update: postUpdate,
  });

  PostDb.find.mockClear();
});
