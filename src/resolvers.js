// import { find, filter } from 'lodash';

import { Author, Post } from './connectors';
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
      return Post.find({ where: args });
    },
    posts() {
      return Post.findAll();
    },
    author(_, args) {
      return Author.find({ where: args });
    },
    authors() {
      return Author.findAll();
    },
  },
  // TODO
  // Mutation: {
  //   upvotePost: (_, { postId }) => {
  //     const post = find(posts, { id: postId });
  //     if (!post) {
  //       throw new Error(`Couldn't find post with id ${postId}`);
  //     }
  //     post.votes += 1;
  //     return post;
  //   },
  // },
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
