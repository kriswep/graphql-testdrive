'use strict';

var _connectors = require('./connectors');

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* globals test expect jest */
global.promiseResolver = () => null;
global.promise = new Promise(resolve => {
  global.promiseResolver = resolve;
});
jest.mock('./connectors', () => ({
  Author: {
    findSub: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn()
  },
  Post: {
    find: jest.fn(() => global.promise),
    findAll: jest.fn(),
    upvotePost: jest.fn()
  }
}));

test('resolvers should have Query, Mutations, Author and Post attributes', () => {
  expect(_resolvers2.default.Query).toBeDefined();
  expect(_resolvers2.default.Mutation).toBeDefined();
  expect(_resolvers2.default.Author).toBeDefined();
  expect(_resolvers2.default.Post).toBeDefined();
});

test('author query should find', () => {
  const expected = 1;
  expect(_resolvers2.default.Query.author.bind(null, '', { id: expected })).not.toThrow();
  expect(_connectors.Author.find).toHaveBeenCalledWith(expected);

  _connectors.Author.find.mockClear();
});

test('user query should find user with sub', () => {
  const expected = 'demosub';
  expect(_resolvers2.default.Query.user.bind(null, '', '', { sub: expected })).not.toThrow();
  expect(_connectors.Author.findSub).toHaveBeenCalledWith(expected);

  _connectors.Author.findSub.mockClear();
});

test('authors query should findAll', () => {
  const expected = { limit: 1, offset: 2, rest: 3 };
  expect(_resolvers2.default.Query.authors.bind(null, '', expected)).not.toThrow();
  expect(_connectors.Author.findAll).toHaveBeenCalledWith(expected.limit, expected.offset, {
    rest: 3
  });

  _connectors.Author.findAll.mockClear();
});

test('post query should find', () => {
  const expected = 1;
  expect(_resolvers2.default.Query.post.bind(null, '', { id: expected })).not.toThrow();
  expect(_connectors.Post.find).toHaveBeenCalledWith(expected);

  _connectors.Post.find.mockClear();
});

test('posts query should findAll', () => {
  const expected = { limit: 1, offset: 2, rest: 3 };
  expect(_resolvers2.default.Query.posts.bind(null, '', expected)).not.toThrow();
  expect(_connectors.Post.findAll).toHaveBeenCalledWith(expected.limit, expected.offset, {
    rest: 3
  });

  _connectors.Post.findAll.mockClear();
});

test('upvotePost mutation should update vote', () => {
  const expected = { postId: 2 };
  expect(_resolvers2.default.Mutation.upvotePost.bind(null, '', { postId: expected })).not.toThrow();
  expect(_connectors.Post.upvotePost).toHaveBeenCalledWith(expected);

  _connectors.Post.upvotePost.mockClear();
  // expect(Post.find).toHaveBeenCalledWith({ where: { id: 2 } });

  // Post.find.mockClear();

  // const postUpdate = jest.fn((args) => {
  //   expect(args).toEqual({ votes: 2 });
  //   return Promise.resolve();
  // });
  // global.promiseResolver({
  //   votes: 1,
  //   update: postUpdate,
  // });

  // Post.find.mockClear();
});

test('Author should getPosts', () => {
  const author = {
    getPosts: jest.fn()
  };

  expect(_resolvers2.default.Author.posts.bind(null, author)).not.toThrow();
  expect(author.getPosts).toHaveBeenCalled();
});

test('Post should getAuthor', () => {
  const post = {
    getAuthor: jest.fn()
  };

  expect(_resolvers2.default.Post.author.bind(null, post)).not.toThrow();
  expect(post.getAuthor).toHaveBeenCalled();
});