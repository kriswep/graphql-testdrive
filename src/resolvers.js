import { omit } from 'lodash';

import { Author, Post } from './connectors';

const resolvers = {
  Query: {
    post(_, { id }, context) {
      console.log(context);
      return Post.find(id);
    },
    posts(_, args) {
      return Post.findAll(
        args.limit,
        args.offset,
        omit(args, ['offset', 'limit']),
      );
    },
    author(_, { id }) {
      return Author.find(id);
    },
    authors(_, args) {
      return Author.findAll(
        args.limit,
        args.offset,
        omit(args, ['offset', 'limit']),
      );
    },
  },
  Mutation: {
    upvotePost: (_, { postId }) => Post.upvotePost(postId),
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
