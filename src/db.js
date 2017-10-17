import Sequelize from 'sequelize';

const db = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite',
  operatorsAliases: false,
});

const AuthorModel = db.define('author', {
  sub: { type: Sequelize.STRING },
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

export { db, AuthorDb, PostDb };
