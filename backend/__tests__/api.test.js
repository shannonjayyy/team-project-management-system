const request = require('supertest');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', require('../routes/users'));
app.use('/api/projects', require('../routes/projects'));
app.use('/api/tasks', require('../routes/tasks'));
beforeAll(async () => { await mongoose.connect(process.env.MONGO_URI); });
afterAll(async () => { await mongoose.connection.close(); });
describe('API Health', () => {
  test('GET /api/users returns array', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test('GET /api/projects returns array', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test('GET /api/tasks returns array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
