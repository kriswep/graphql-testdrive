'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _connectors = require('./connectors');

// import { authors, posts } from './mock';

// export const staticResolvers = {
//   Query: {
//     posts: () => posts,
//     author: (_, { id }) => find(authors, { id: id }),
//   },
//   Mutation: {
//     upvotePost: (_, { postId }) => {
//       const post = find(posts, { id: postId });
//       if (!post) {
//         throw new Error(`Couldn't find post with id ${postId}`);
//       }
//       post.votes += 1;
//       return post;
//     },
//   },
//   Author: {
//     posts: author => filter(posts, { authorId: author.id }),
//   },
//   Post: {
//     author: post => find(authors, { id: post.authorId }),
//   },
// };

const resolvers = {
  Query: {
    post(_, args) {
      return _connectors.Post.find({ where: args });
    },
    posts(_, args) {
      // return Post.findAll();
      return _connectors.Post.findAll({
        limit: args.limit,
        offset: args.offset,
        where: (0, _lodash.omit)(args, ['offset', 'limit'])
      });
    },
    author(_, args) {
      return _connectors.Author.find({ where: args });
    },
    authors(_, args) {
      return _connectors.Author.findAll({
        limit: args.limit,
        offset: args.offset,
        where: (0, _lodash.omit)(args, ['offset', 'limit'])
      });
      // return Author.findAll({ where: args }).then(res => [res]);
    }
  },
  Mutation: {
    upvotePost: (_, { id }) => _connectors.Post.find({ where: id }).then(post => post.update({
      votes: post.votes + 1
    }).then(() => _connectors.Post.find({ where: id })))
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