const request = require('supertest');
const app = require('..');
const fs = require('fs');
const path = require('path');

describe('Markers API', () => {
  const filePath = path.join(__dirname, '../../data/markers.json');

  // Clean up before each test
  beforeEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  it('GET /api/markers should return 200 and an array', async () => {
    const res = await request(app).get('/api/markers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/markers/save should save a marker and return success', async () => {
    const marker = [{ id: 1, x: 100, y: 200, label: 'A' }];
    const res = await request(app)
      .post('/api/markers/save')
      .send(marker)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Confirm marker was saved
    const getRes = await request(app).get('/api/markers');
    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0]).toMatchObject(marker[0]);
  });
});
