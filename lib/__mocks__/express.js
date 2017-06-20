"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/* globals jest */
exports.default = () => ({
  use: jest.fn(),
  listen: jest.fn((port, ip, cb) => cb())
});