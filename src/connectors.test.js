/* globals test expect jest */
import { db, Author, Post } from './connectors';

test('connectors should define db, Author and Post', () => {
  expect(db).toBeDefined();
  expect(db.models.author).toBeDefined();
  expect(db.models.author.attributes.firstName.field).toEqual('firstName');
  expect(db.models.author.attributes.lastName.field).toEqual('lastName');
  expect(db.models.author.associations.posts.associationAccessor).toEqual(
    'posts',
  );
  expect(db.models.author.associations.posts.associationType).toEqual(
    'HasMany',
  );

  expect(db.models.post).toBeDefined();
  expect(db.models.post.attributes.title.field).toEqual('title');
  expect(db.models.post.associations.author.associationAccessor).toEqual(
    'author',
  );
  expect(db.models.post.associations.author.associationType).toEqual(
    'BelongsTo',
  );

  expect(Author).toBeDefined();
  expect(Post).toBeDefined();
});

test('author find should not throw', () => {
  const expected = 1;
  expect(Author.find.bind(null, expected)).not.toThrow();
});

test('author findAll should not throw', () => {
  const expected = { limit: 1, offset: 2, rest: { id: 1 } };
  expect(
    Author.findAll.bind(null, expected.limit, expected.offset, expected.rest),
  ).not.toThrow();
});

test('author getPosts should get Posts', () => {
  const author = { getPosts: jest.fn(() => true) };
  expect(Author.getPosts(author)).toBeTruthy();
  expect(author.getPosts).toHaveBeenCalled();
});

test('post find should not throw', () => {
  const expected = 1;
  expect(Post.find.bind(null, expected)).not.toThrow();
});

test('post findAll should not throw', () => {
  const expected = { limit: 1, offset: 2, rest: { id: 1 } };
  expect(
    Post.findAll.bind(null, expected.limit, expected.offset, expected.rest),
  ).not.toThrow();
});

test('post getAuthor should get Author', () => {
  const post = { getAuthor: jest.fn(() => true) };
  expect(Post.getAuthor(post)).toBeTruthy();
  expect(post.getAuthor).toHaveBeenCalled();
});

test('post upvotePost should not throw', () => {
  const expected = 1;
  expect(Post.upvotePost.bind(null, expected)).not.toThrow();
});
