/* globals test expect jest */
import { Author, Post } from './connectors';
import resolvers from './resolvers';

global.promiseResolver = () => null;
global.promise = new Promise((resolve) => {
  global.promiseResolver = resolve;
});
jest.mock('./connectors', () => ({
  Author: {
    findSub: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
  },
  Post: {
    find: jest.fn(() => global.promise),
    findAll: jest.fn(),
    upvotePost: jest.fn(),
  },
}));

test('resolvers should have Query, Mutations, Author and Post attributes', () => {
  expect(resolvers.Query).toBeDefined();
  expect(resolvers.Mutation).toBeDefined();
  expect(resolvers.Author).toBeDefined();
  expect(resolvers.Post).toBeDefined();
});

test('author query should find', () => {
  const expected = 1;
  expect(resolvers.Query.author.bind(null, '', { id: expected })).not.toThrow();
  expect(Author.find).toHaveBeenCalledWith(expected);

  Author.find.mockClear();
});

test('user query should find user with sub', () => {
  const expected = 'demosub';
  expect(
    resolvers.Query.user.bind(null, '', '', { sub: expected }),
  ).not.toThrow();
  expect(Author.findSub).toHaveBeenCalledWith(expected);

  Author.findSub.mockClear();
});

test('authors query should findAll', () => {
  const expected = { limit: 1, offset: 2, rest: 3 };
  expect(resolvers.Query.authors.bind(null, '', expected)).not.toThrow();
  expect(Author.findAll).toHaveBeenCalledWith(expected.limit, expected.offset, {
    rest: 3,
  });

  Author.findAll.mockClear();
});

test('post query should find', () => {
  const expected = 1;
  expect(resolvers.Query.post.bind(null, '', { id: expected })).not.toThrow();
  expect(Post.find).toHaveBeenCalledWith(expected);

  Post.find.mockClear();
});

test('posts query should findAll', () => {
  const expected = { limit: 1, offset: 2, rest: 3 };
  expect(resolvers.Query.posts.bind(null, '', expected)).not.toThrow();
  expect(Post.findAll).toHaveBeenCalledWith(expected.limit, expected.offset, {
    rest: 3,
  });

  Post.findAll.mockClear();
});

test('upvotePost mutation should update vote', () => {
  const expected = { postId: 2 };
  expect(
    resolvers.Mutation.upvotePost.bind(null, '', { postId: expected }),
  ).not.toThrow();
  expect(Post.upvotePost).toHaveBeenCalledWith(expected);

  Post.upvotePost.mockClear();
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
