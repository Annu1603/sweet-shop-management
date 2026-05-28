jest.mock('../server', () => {
  const express = require('express');
  const app = express();

  return app;
});

import app from '../server';

describe('Sweets API', () => {
  test('Dummy sweets test', () => {
    expect(true).toBe(true);
  });
});


