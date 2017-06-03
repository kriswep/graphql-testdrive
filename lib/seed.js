'use strict';

var _casual = require('casual');

var _casual2 = _interopRequireDefault(_casual);

var _lodash = require('lodash');

var _connectors = require('./connectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function seed() {
  // create mock data with a seed, so we always get the same
  _casual2.default.seed(123);
  _connectors.db.sync({ force: true }).then(() => {
    (0, _lodash.times)(10, () => _connectors.Author.create({
      firstName: _casual2.default.first_name,
      lastName: _casual2.default.last_name
    }).then(author => {
      (0, _lodash.times)(5, number => author.createPost({
        title: `${number + 1}. post by ${author.firstName}`,
        text: _casual2.default.sentences(3),
        votes: _casual2.default.integer(0, 50)
      }));
    }));
  });
})(); /**
       * seed our database
       */