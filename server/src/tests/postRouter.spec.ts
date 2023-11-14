import { app } from '@/tests/setup';
import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';

const TEST_USER = {
  email: 'test_user@friendlink.com',
  password: 'passworD1!',
  confirmPassword: 'passworD1!',
  username: 'test_user',
};

let jwtCookies: string;

before(async () => {
  const res = await request(app).post('/auth/signup').send(TEST_USER);
  jwtCookies = res.header['set-cookie'][0];
});

describe('POST /posts', () => {
  it('should return 401 if user is not logged in', async () => {
    const { statusCode, body } = await request(app).post('/posts').send({});

    expect(statusCode).to.equal(401);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Unauthorized');
  });

  it('should return 400 if request body is empty', async () => {
    const { statusCode, body } = await request(app)
      .post('/posts')
      .set('Cookie', jwtCookies)
      .send({});

    expect(statusCode).to.equal(400);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Please provide content for your post');
  });

  it('should return 201 if post is created successfully', async () => {
    const { statusCode, body } = await request(app)
      .post('/posts')
      .set('Cookie', jwtCookies)
      .send({ content: 'This is a test post' });

    console.log(body);

    expect(statusCode).to.equal(201);
    expect(body.success).to.be.true;
    expect(body.message).to.equal('Post created');
  });
});

describe('GET /posts/:id', () => {
  it('should return 401 if user is not logged in', async () => {
    const { statusCode, body } = await request(app).get('/posts/1').send({});

    expect(statusCode).to.equal(401);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Unauthorized');
  });
});

describe('PATCH /posts/:id', () => {
  it('should return 401 if user is not logged in', async () => {
    const { statusCode, body } = await request(app).patch('/posts/1').send({});

    expect(statusCode).to.equal(401);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Unauthorized');
  });
});

describe('DELETE /posts/:id', () => {
  it('should return 401 if user is not logged in', async () => {
    const { statusCode, body } = await request(app).delete('/posts/1').send({});

    expect(statusCode).to.equal(401);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Unauthorized');
  });
});

describe('POST /posts/:id/like', () => {
  it('should return 401 if user is not logged in', async () => {
    const { statusCode, body } = await request(app)
      .post('/posts/1/like')
      .send({});

    expect(statusCode).to.equal(401);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Unauthorized');
  });
});

describe('DELETE /posts/:id/like', () => {
  it('should return 401 if user is not logged in', async () => {
    const { statusCode, body } = await request(app)
      .delete('/posts/1/like')
      .send({});

    expect(statusCode).to.equal(401);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Unauthorized');
  });
});

describe('POST /posts/:id/comments', () => {
  it('should return 401 if user is not logged in', async () => {
    const { statusCode, body } = await request(app)
      .post('/posts/1/comments')
      .send({});

    expect(statusCode).to.equal(401);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Unauthorized');
  });
});

describe('PATCH /posts/:id/comments/:commentId', () => {
  it('should return 401 if user is not logged in', async () => {
    const { statusCode, body } = await request(app)
      .patch('/posts/1/comments/1')
      .send({});

    expect(statusCode).to.equal(401);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Unauthorized');
  });
});

describe('DELETE /posts/:id/comments/:commentId', () => {
  it('should return 401 if user is not logged in', async () => {
    const { statusCode, body } = await request(app)
      .delete('/posts/1/comments/1')
      .send({});

    expect(statusCode).to.equal(401);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('Unauthorized');
  });
});
