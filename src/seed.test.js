/* globals test expect jest */
import { db, Author } from './connectors';
import './seed';

global.createPost = jest.fn();
jest.mock('./connectors', () => ({
  db: {
    sync: jest.fn(() => Promise.resolve()),
    models: {
      author: {
        create: jest.fn(() =>
          Promise.resolve({ createPost: global.createPost }),
        ),
      },
    },
  },
  Author: {
    create: jest.fn(() =>
      Promise.resolve({
        createPost: global.createPost,
      }),
    ),
  },
}));

test('should seed database', () => {
  expect(db.sync).toHaveBeenCalled();
  expect(db.models.author.create).toHaveBeenCalled();
  expect(db.models.author.create.mock.calls.length).toBe(10);
  expect(global.createPost).toHaveBeenCalled();
  expect(global.createPost.mock.calls.length).toBe(50);
});
