/**
 * seed our database
 */
import casual from 'casual';
import { times } from 'lodash';

import { db, Author } from './connectors';

(async function seed() {
  // create mock data with a seed, so we always get the same
  casual.seed(123);
  db.sync({ force: true }).then(() => {
    times(10, () =>
      Author.create({
        firstName: casual.first_name,
        lastName: casual.last_name,
      }).then((author) => {
        times(5, number =>
          author.createPost({
            title: `${number + 1}. post by ${author.firstName}`,
            text: casual.sentences(3),
            votes: casual.integer(0, 50),
          }),
        );
      }),
    );
  });
}()).catch((ex) => {
  console.log(`ERROR: ${ex}`); // eslint-disable-line
});
