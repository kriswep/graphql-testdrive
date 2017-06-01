// https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035

import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';

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

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      _.times(5, (number) => {
        return author.createPost({
          title: `${number + 1}. post by ${author.firstName}`,
          text: casual.sentences(3),
          votes: casual.integer(0, 50),
        });
      });
    });
  });
});

const Author = db.models.author;
const Post = db.models.post;

export { Author, Post };
