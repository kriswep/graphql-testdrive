'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = exports.Author = undefined;

var _db = require('./db');

const Author = {
  findSub(sub) {
    return _db.AuthorDb.find({ where: { sub } });
  },
  find(id) {
    return _db.AuthorDb.find({ where: { id } });
  },
  findAll(limit, offset, args) {
    return _db.AuthorDb.findAll({
      limit,
      offset,
      where: args
    });
  },
  getPosts(author) {
    return author.getPosts();
  }
}; // https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035


const Post = {
  find(id) {
    return _db.PostDb.find({ where: { id } });
  },
  findAll(limit, offset, args) {
    return _db.PostDb.findAll({
      limit,
      offset,
      where: args
    });
  },
  getAuthor(post) {
    return post.getAuthor();
  },
  upvotePost(id) {
    return _db.PostDb.find({ where: { id } }).then(post => post.update({
      votes: post.votes + 1
    }).then(() => _db.PostDb.find({ where: { id } })));
  }
};

exports.Author = Author;
exports.Post = Post;