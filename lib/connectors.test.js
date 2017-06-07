'use strict';

var _connectors = require('./connectors');

test('connectors should define db, Author and Post', () => {
  expect(_connectors.db).toBeDefined();
  expect(_connectors.db.models.author).toBeDefined();
  expect(_connectors.db.models.author.attributes.firstName.field).toEqual('firstName');
  expect(_connectors.db.models.author.attributes.lastName.field).toEqual('lastName');
  expect(_connectors.db.models.author.associations.posts.associationAccessor).toEqual('posts');
  expect(_connectors.db.models.author.associations.posts.associationType).toEqual('HasMany');

  expect(_connectors.db.models.post).toBeDefined();
  expect(_connectors.db.models.post.attributes.title.field).toEqual('title');
  expect(_connectors.db.models.post.associations.author.associationAccessor).toEqual('author');
  expect(_connectors.db.models.post.associations.author.associationType).toEqual('BelongsTo');

  expect(_connectors.Author).toBeDefined();
  expect(_connectors.Post).toBeDefined();
}); /* globals test expect jest */


test('author find should not throw', () => {
  const expected = 1;
  expect(_connectors.Author.find.bind(null, expected)).not.toThrow();
});

test('author findAll should not throw', () => {
  const expected = { limit: 1, offset: 2, rest: { id: 1 } };
  expect(_connectors.Author.findAll.bind(null, expected.limit, expected.offset, expected.rest)).not.toThrow();
});

test('author getPosts should get Posts', () => {
  const author = { getPosts: jest.fn(() => true) };
  expect(_connectors.Author.getPosts(author)).toBeTruthy();
  expect(author.getPosts).toHaveBeenCalled();
});

test('post find should not throw', () => {
  const expected = 1;
  expect(_connectors.Post.find.bind(null, expected)).not.toThrow();
});

test('post findAll should not throw', () => {
  const expected = { limit: 1, offset: 2, rest: { id: 1 } };
  expect(_connectors.Post.findAll.bind(null, expected.limit, expected.offset, expected.rest)).not.toThrow();
});

test('post getAuthor should get Author', () => {
  const post = { getAuthor: jest.fn(() => true) };
  expect(_connectors.Post.getAuthor(post)).toBeTruthy();
  expect(post.getAuthor).toHaveBeenCalled();
});

test('post upvotePost should not throw', () => {
  const expected = 1;
  expect(_connectors.Post.upvotePost.bind(null, expected)).not.toThrow();
});