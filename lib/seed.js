'use strict';

var _casual = require('casual');

var _casual2 = _interopRequireDefault(_casual);

var _lodash = require('lodash');

var _db = require('./db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * seed our database
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


(() => {
  var _ref = _asyncToGenerator(function* () {
    // create mock data with a seed, so we always get the same
    _casual2.default.seed(123);
    _db.db.sync({ force: true }).then(function () {
      (0, _lodash.times)(10, function () {
        return _db.AuthorDb.create({
          firstName: _casual2.default.first_name,
          lastName: _casual2.default.last_name
        }).then(function (author) {
          (0, _lodash.times)(5, function (number) {
            return author.createPost({
              title: `${number + 1}. post by ${author.firstName}`,
              text: _casual2.default.sentences(3),
              votes: _casual2.default.integer(0, 50)
            });
          });
        });
      });
    });
  });

  function seed() {
    return _ref.apply(this, arguments);
  }

  return seed;
})()();