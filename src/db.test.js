/* globals test expect */
import { db, AuthorDb, PostDb } from './db';

test('connectors should define db, Author and Post', () => {
  expect(db).toBeDefined();
  expect(AuthorDb).toBeDefined();
  expect(AuthorDb.attributes.firstName.field).toEqual('firstName');
  expect(AuthorDb.attributes.lastName.field).toEqual('lastName');
  expect(AuthorDb.associations.posts.associationAccessor).toEqual('posts');
  expect(AuthorDb.associations.posts.associationType).toEqual('HasMany');

  expect(PostDb).toBeDefined();
  expect(PostDb.attributes.title.field).toEqual('title');
  expect(PostDb.associations.author.associationAccessor).toEqual('author');
  expect(PostDb.associations.author.associationType).toEqual('BelongsTo');
});
