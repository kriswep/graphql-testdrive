// https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035

import Sequelize from 'sequelize';

const db = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite',
});

const AuthorModel = db.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
});

const PostModel = db.define('post', {
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING },
  votes: { type: Sequelize.INTEGER },
});

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

const AuthorDb = db.models.author;
const PostDb = db.models.post;

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

export { db, Author, Post };
