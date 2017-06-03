'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const authors = exports.authors = [{ id: 1, firstName: 'Benjamin', lastName: 'Weber' }, { id: 2, firstName: 'Stan', lastName: 'Mayer' }, { id: 3, firstName: 'Christoph', lastName: 'Darwin' }];

const posts = exports.posts = [{ id: 1, authorId: 1, title: 'First great post', votes: 2 }, { id: 2, authorId: 2, title: 'GraphQL Rocks', votes: 3 }, { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 }, { id: 4, authorId: 3, title: 'This works', votes: 7 }];