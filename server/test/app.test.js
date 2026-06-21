import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/index.js';

test('GET /api/health returns service status', async () => {
  const response = await request(app).get('/api/health').expect(200);
  assert.equal(response.body.status, 'ok');
});

test('unknown API routes return JSON 404', async () => {
  const response = await request(app).get('/api/does-not-exist').expect(404);
  assert.equal(response.body.error, 'API route not found.');
});

test('CORS rejects an untrusted browser origin', async () => {
  const response = await request(app)
    .get('/api/health')
    .set('Origin', 'https://malicious.example')
    .expect(403);

  assert.equal(response.body.error, 'Origin is not allowed.');
});
