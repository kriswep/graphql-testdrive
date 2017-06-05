import { omit } from 'lodash';

import { Author, Post } from './connectors';

const resolvers = {
  Query: {
    post(_, args) {
      return Post.find({ where: args });
    },
    posts(_, args) {
      return Post.findAll({
        limit: args.limit,
        offset: args.offset,
        where: omit(args, ['offset', 'limit']),
      });
    },
    author(_, args) {
      return Author.find({ where: args });
    },
    authors(_, args) {
      return Author.findAll({
        limit: args.limit,
        offset: args.offset,
        where: omit(args, ['offset', 'limit']),
      });
    },
  },
  Mutation: {
    upvotePost: (_, { postId }) =>
      Post.find({ where: { id: postId } }).then(post =>
        post
          .update({
            votes: post.votes + 1,
          })
          .then(() => Post.find({ where: { id: postId } })),
      ),
  },
  Author: {
    posts(author) {
      return author.getPosts();
    },
  },
  Post: {
    author(post) {
      return post.getAuthor();
    },
  },
};

export default resolvers;
