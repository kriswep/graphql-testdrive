'use strict';

var _db = require('./db');

test('connectors should define db, Author and Post', () => {
  expect(_db.db).toBeDefined();
  expect(_db.AuthorDb).toBeDefined();
  expect(_db.AuthorDb.attributes.firstName.field).toEqual('firstName');
  expect(_db.AuthorDb.attributes.lastName.field).toEqual('lastName');
  expect(_db.AuthorDb.associations.posts.associationAccessor).toEqual('posts');
  expect(_db.AuthorDb.associations.posts.associationType).toEqual('HasMany');

  expect(_db.PostDb).toBeDefined();
  expect(_db.PostDb.attributes.title.field).toEqual('title');
  expect(_db.PostDb.associations.author.associationAccessor).toEqual('author');
  expect(_db.PostDb.associations.author.associationType).toEqual('BelongsTo');
}); /* globals test expect */