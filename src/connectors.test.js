/* globals test expect */
import { db, Author, Post } from './connectors';

test('connectors should define db, Author and Post', () => {
  expect(db).toBeDefined();
  expect(Author).toBeDefined();
  expect(Author.attributes.firstName.field).toEqual('firstName');
  expect(Author.attributes.lastName.field).toEqual('lastName');
  expect(Author.associations.posts.associationAccessor).toEqual('posts');
  expect(Author.associations.posts.associationType).toEqual('HasMany');

  expect(Post).toBeDefined();
  expect(Post.attributes.title.field).toEqual('title');
  expect(Post.associations.author.associationAccessor).toEqual('author');
  expect(Post.associations.author.associationType).toEqual('BelongsTo');
});
