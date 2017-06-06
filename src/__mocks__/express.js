/* globals jest */
export default () => ({
  use: jest.fn(),
  listen: jest.fn((port, ip, cb) => cb()),
});
