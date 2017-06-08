// https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035
import { AuthorDb, PostDb } from './db';

const Author = {
  find(id) {
    return AuthorDb.find({ where: { id } });
  },
  findAll(limit, offset, args) {
    return AuthorDb.findAll({
      limit,
      offset,
      where: args,
    });
  },
  getPosts(author) {
    return author.getPosts();
  },
};

const Post = {
  find(id) {
    return PostDb.find({ where: { id } });
  },
  findAll(limit, offset, args) {
    return PostDb.findAll({
      limit,
      offset,
      where: args,
    });
  },
  getAuthor(post) {
    return post.getAuthor();
  },
  upvotePost(id) {
    return PostDb.find({ where: { id } }).then(post =>
      post
        .update({
          votes: post.votes + 1,
        })
        .then(() => PostDb.find({ where: { id } })),
    );
  },
};

export { Author, Post };
