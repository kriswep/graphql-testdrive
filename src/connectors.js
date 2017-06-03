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

const Author = db.models.author;
const Post = db.models.post;

export { db, Author, Post };
