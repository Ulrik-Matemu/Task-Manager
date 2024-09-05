const request = require('supertest');
const app = require('./index');

describe('GET /tasks', () => {
    it('should return all tasks', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});