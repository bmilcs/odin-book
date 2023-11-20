import { USER_ONE, app } from '@/tests/setup';
import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';

describe('POST ROUTER', () => {
  //
  // CREATE POST
  //

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
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Please provide content for your post');
    });

    it('should return 201 if post is created successfully', async () => {
      const { statusCode, body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'This is a test post' });

      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post created');
    });
  });

  //
  // GET POST
  //

  describe('GET /posts/:id', () => {
    let validPostId: string;
    before(async function createPost() {
      const { statusCode, body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'This is a test post' });
      validPostId = body.data._id;
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).get('/posts/1').send({});
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .get('/posts/invalid')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 404 if post is not found', async () => {
      const invalidMongoId = '111111111111111111111111';
      const { statusCode, body } = await request(app)
        .get(`/posts/${invalidMongoId}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 200 if post is found', async () => {
      const { statusCode, body } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post found');
    });
  });

  //
  // UPDATE POST
  //

  describe('PATCH /posts/:id', () => {
    let validPostId: string;
    before(async function createPost() {
      const { statusCode, body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      validPostId = body.data._id;
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app)
        .patch('/posts/1')
        .send({});
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .patch('/posts/invalid')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 404 if post is not found', async () => {
      const invalidMongoId = '111111111111111111111111';
      const { statusCode, body } = await request(app)
        .patch(`/posts/${invalidMongoId}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Dummy content' });
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 400 if request body is empty', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Please provide content for your post');
    });

    it('should return 200 if post is updated successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Updated test post' });

      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post updated');
      // check db
      const { statusCode: code, body: res } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(code).to.equal(200);
      expect(res.success).to.be.true;
      expect(res.message).to.equal('Post found');
      expect(res.data.content).to.equal('Updated test post');
    });
  });

  //
  // DELETE POST
  //

  describe('DELETE /posts/:id', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app)
        .delete('/posts/1')
        .send({});
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });
  });

  //
  // LIKE POST
  //

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

  //
  // UNLIKE POST
  //

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

  //
  // ADD POST COMMENT
  //

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

  //
  // EDIT POST COMMENT
  //

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

  //
  // DELETE POST COMMENT
  //

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

  //
  // LIKE POST COMMENT
  //

  describe('POST /posts/:id/comments/:commentId/like', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app)
        .post('/posts/1/comments/1/like')
        .send({});
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });
  });

  //
  // UNLIKE POST COMMENT
  //

  describe('DELETE /posts/:id/comments/:commentId/like', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app)
        .delete('/posts/1/comments/1/like')
        .send({});
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });
  });
});
