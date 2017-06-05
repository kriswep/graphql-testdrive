/* globals test expect */
import typeDefs from './schema';

test('schema definition should be the right one', () => {
  expect(typeDefs).toMatchSnapshot();
});
