import { app } from '@/tests/setup';
import { expect } from 'chai';
import request from 'supertest';

describe('POST /auth/signup', () => {
  it('should validate signup data (empty inputs)', async () => {
    const { body, statusCode } = await request(app)
      .post('/auth/signup')
      .send({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
      .expect('Content-Type', /json/);

    expect(statusCode).equal(400);
    expect(body.result).equal('ValidationError');
    expect(body.errors).to.be.an('array');

    const expectedErrorMsgs = [
      'Username must be between 3 and 50 characters',
      'Email must be valid',
      'Password must be between 8 and 50 characters',
    ];

    const errorMsgs = body.errors.map((error: any) => error.msg);
    expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
  });

  it('should validate signup data (mismatched passwords)', async () => {
    const { body, statusCode } = await request(app)
      .post('/auth/signup')
      .send({
        username: 'adam',
        email: 'adam@jones.com',
        password: 'Aa1sssss!',
        confirmPassword: 'Aa1sssss!!',
      })
      .expect('Content-Type', /json/);

    expect(statusCode).equal(400);
    expect(body.result).equal('ValidationError');
    expect(body.errors).to.be.an('array');

    const expectedErrorMsgs = ['Passwords must match'];
    const errorMsgs = body.errors.map((error: any) => error.msg);
    expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
  });

  it('should validate signup data (duplicate email)', async () => {
    // signup user
    // logout
    // signup user with same email
    expect(true).equal(false);
  });

  it('should validate signup data (duplicate username)', async () => {
    // signup user
    // logout
    // signup user with same username
    expect(true).equal(false);
  });

  it('should create a new user', async () => {
    const { body, statusCode } = await request(app)
      .post('/auth/signup')
      .send({
        username: 'adam',
        email: 'adam@smith.com',
        password: 'Password1!',
        confirmPassword: 'Password1!',
      })
      .expect('Content-Type', /json/);

    expect(statusCode).equal(200);
    expect(body.result).equal('Success');
  });
});
