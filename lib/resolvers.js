'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _connectors = require('./connectors');

const resolvers = {
  Query: {
    post(_, { id }) {
      return _connectors.Post.find(id);
    },
    posts(_, args) {
      return _connectors.Post.findAll(args.limit, args.offset, (0, _lodash.omit)(args, ['offset', 'limit']));
    },
    author(_, { id }) {
      return _connectors.Author.find(id);
    },
    authors(_, args) {
      return _connectors.Author.findAll(args.limit, args.offset, (0, _lodash.omit)(args, ['offset', 'limit']));
    }
  },
  Mutation: {
    upvotePost: (_, { postId }) => _connectors.Post.upvotePost(postId)
  },
  Author: {
    posts(author) {
      return author.getPosts();
    }
  },
  Post: {
    author(post) {
      return post.getAuthor();
    }
  }
};

exports.default = resolvers;