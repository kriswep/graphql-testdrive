/* globals test expect jest */
import { Author, Post } from './connectors';
import resolvers from './resolvers';

global.promiseResolver = () => null;
global.promise = new Promise((resolve) => {
  global.promiseResolver = resolve;
});
jest.mock('./connectors', () => ({
  Author: {
    find: jest.fn(),
    findAll: jest.fn(),
  },
  Post: {
    find: jest.fn(() => global.promise),
    findAll: jest.fn(),
  },
}));

test('resolvers should have Query, Mutations, Author and Post attributes', () => {
  expect(resolvers.Query).toBeDefined();
  expect(resolvers.Mutation).toBeDefined();
  expect(resolvers.Author).toBeDefined();
  expect(resolvers.Post).toBeDefined();
});

test('author query should find', () => {
  const expected = { id: 1 };
  expect(resolvers.Query.author.bind(null, '', expected)).not.toThrow();
  expect(Author.find).toHaveBeenCalledWith({ where: expected });

  Author.find.mockClear();
});

test('authors query should findAll', () => {
  const expected = { limit: 1, offset: 2, rest: 3 };
  expect(resolvers.Query.authors.bind(null, '', expected)).not.toThrow();
  expect(Author.findAll).toHaveBeenCalledWith({
    limit: expected.limit,
    offset: expected.offset,
    where: { rest: 3 },
  });

  Author.findAll.mockClear();
});

test('post query should find', () => {
  const expected = { id: 1 };
  expect(resolvers.Query.post.bind(null, '', expected)).not.toThrow();
  expect(Post.find).toHaveBeenCalledWith({ where: expected });

  Post.find.mockClear();
});

test('posts query should findAll', () => {
  const expected = { limit: 1, offset: 2, rest: 3 };
  expect(resolvers.Query.posts.bind(null, '', expected)).not.toThrow();
  expect(Post.findAll).toHaveBeenCalledWith({
    limit: expected.limit,
    offset: expected.offset,
    where: { rest: 3 },
  });

  Post.findAll.mockClear();
});

test('upvotePost mutation should update vote', () => {
  const expected = { postId: 2 };
  expect(resolvers.Mutation.upvotePost.bind(null, '', expected)).not.toThrow();
  expect(Post.find).toHaveBeenCalledWith({ where: { id: 2 } });

  Post.find.mockClear();

  const postUpdate = jest.fn((args) => {
    expect(args).toEqual({ votes: 2 });
    return Promise.resolve();
  });
  global.promiseResolver({
    votes: 1,
    update: postUpdate,
  });

  Post.find.mockClear();
});

test('Author should getPosts', () => {
  const author = {
    getPosts: jest.fn(),
  };

  expect(resolvers.Author.posts.bind(null, author)).not.toThrow();
  expect(author.getPosts).toHaveBeenCalled();
});

test('Post should getAuthor', () => {
  const post = {
    getAuthor: jest.fn(),
  };

  expect(resolvers.Post.author.bind(null, post)).not.toThrow();
  expect(post.getAuthor).toHaveBeenCalled();
});
