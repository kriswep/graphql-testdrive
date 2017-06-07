'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = exports.Author = exports.db = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const db = new _sequelize2.default('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite'
}); // https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035

const AuthorModel = db.define('author', {
  firstName: { type: _sequelize2.default.STRING },
  lastName: { type: _sequelize2.default.STRING }
});

const PostModel = db.define('post', {
  title: { type: _sequelize2.default.STRING },
  text: { type: _sequelize2.default.STRING },
  votes: { type: _sequelize2.default.INTEGER }
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
      where: args
    });
  },
  getPosts(author) {
    return author.getPosts();
  }
};

const Post = {
  find(id) {
    return PostDb.find({ where: { id } });
  },
  findAll(limit, offset, args) {
    return PostDb.findAll({
      limit,
      offset,
      where: args
    });
  },
  getAuthor(post) {
    return post.getAuthor();
  },
  upvotePost(id) {
    return PostDb.find({ where: { id } }).then(post => post.update({
      votes: post.votes + 1
    }).then(() => PostDb.find({ where: { id } })));
  }
};

exports.db = db;
exports.Author = Author;
exports.Post = Post;