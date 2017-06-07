'use strict';

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('schema definition should be the right one', () => {
  expect(_schema2.default).toMatchSnapshot();
}); /* globals test expect */