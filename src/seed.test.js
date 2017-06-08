/* globals test expect jest */
import { db, AuthorDb } from './db';
import './seed';

global.createPost = jest.fn();
jest.mock('./db', () => ({
  db: {
    sync: jest.fn(() => Promise.resolve()),
  },
  AuthorDb: {
    create: jest.fn(() =>
      Promise.resolve({
        createPost: global.createPost,
      }),
    ),
  },
}));

test('should seed database', () => {
  expect(db.sync).toHaveBeenCalled();
  expect(AuthorDb.create).toHaveBeenCalled();
  expect(AuthorDb.create.mock.calls.length).toBe(10);
  expect(global.createPost).toHaveBeenCalled();
  expect(global.createPost.mock.calls.length).toBe(50);
});
