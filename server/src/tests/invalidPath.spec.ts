import { app } from '@/tests/setup';
import { expect } from 'chai';
import request from 'supertest';

describe('Invalid Paths', () => {
  it('should respond with 404', async () => {
    const res = await request(app).get('/invalid-path').expect(404);
    expect(res.body.success).to.be.false;
    expect(res.body.message).to.equal('API endpoint not found');
    expect(res.body.error).to.equal('InvalidPath');
  });
});
