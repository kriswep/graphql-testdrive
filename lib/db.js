'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostDb = exports.AuthorDb = exports.db = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const db = new _sequelize2.default('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite'
});

const AuthorModel = db.define('author', {
  sub: { type: _sequelize2.default.STRING },
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

exports.db = db;
exports.AuthorDb = AuthorDb;
exports.PostDb = PostDb;