import { NONEXISTENT_MONGODB_ID, USER_ONE, USER_TWO, app } from '@/tests/setup';
import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';

describe('POST ROUTER', () => {
  //
  // CREATE POST
  //

  describe('POST /posts', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).post('/posts');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if request body is empty', async () => {
      const { statusCode, body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie);
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
    let validCommentId: string;
    before(async function createPost() {
      const { statusCode, body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'This is a test post' });
      validPostId = body.data._id;
      const { body: commentBody } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_TWO.jwtCookie)
        .send({ content: 'Comment 1' });
      validCommentId = commentBody.data._id;
      const { body: likeBody } = await request(app)
        .post(`/posts/${validPostId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).get('/posts/1');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .get('/posts/invalid')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .get(`/posts/${NONEXISTENT_MONGODB_ID}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 201 if post is received', async () => {
      const { statusCode, body } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
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
      const { statusCode, body } = await request(app).patch('/posts/1');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .patch('/posts/invalid')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${NONEXISTENT_MONGODB_ID}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Dummy content' });
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 400 if request body is empty', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Please provide content for your post');
    });

    it('should return 201 if post is updated successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Updated test post' });

      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post updated');
      // check db
      const { statusCode: code, body: res } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(code).to.equal(201);
      expect(res.success).to.be.true;
      expect(res.message).to.equal('Post found');
      expect(res.data.content).to.equal('Updated test post');
    });
  });

  //
  // DELETE POST
  //

  describe('DELETE /posts/:id', () => {
    let validPostId: string;
    let validCommentId: string;
    let validLikeId: string;
    before(async function createPostWithCommentsAndLikes() {
      const { body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      validPostId = body.data._id;
      // add comments
      const { body: commentBody } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_TWO.jwtCookie)
        .send({ content: 'Comment 1' });
      validCommentId = commentBody.data._id;
      // add likes
      const { body: likeBody } = await request(app)
        .post(`/posts/${validPostId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      validLikeId = likeBody.data._id;
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).delete('/posts/1');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .delete('/posts/invalid')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${NONEXISTENT_MONGODB_ID}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 200 if post is deleted successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post deleted');
      // check db: post
      const { statusCode: code, body: res } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(code).to.equal(404);
      expect(res.success).to.be.false;
      expect(res.error).to.equal('Post not found');
      // check db: comments
      const { statusCode: commentCode, body: commentRes } = await request(app)
        .get(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(commentCode).to.equal(404);
      expect(commentRes.success).to.be.false;
      expect(commentRes.error).to.equal('InvalidPath');
    });
  });

  //
  // LIKE POST
  //

  describe('POST /posts/:id/like', () => {
    let validPostId: string;
    before(async function createPost() {
      const { statusCode, body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      validPostId = body.data._id;
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).post('/posts/1/like');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .post('/posts/invalid/like')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .post(`/posts/${NONEXISTENT_MONGODB_ID}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 201 if post is liked successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .post(`/posts/${validPostId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post liked');
      // check db
      const { statusCode: code, body: res } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(code).to.equal(201);
      expect(res.success).to.be.true;
      expect(res.data.likes).to.be.an('array');
      expect(res.data.likes[0]).to.be.an.string;
    });
  });

  //
  // UNLIKE POST
  //

  describe('DELETE /posts/:id/like', () => {
    let validPostId: string;
    before(async function createPost() {
      const { statusCode, body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      validPostId = body.data._id;
      // like post
      await request(app)
        .post(`/posts/${validPostId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).delete('/posts/1/like');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .delete('/posts/invalid/like')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${NONEXISTENT_MONGODB_ID}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 200 if post is unliked successfully', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post unliked');
    });
  });

  //
  // ADD POST COMMENT
  //

  describe('POST /posts/:id/comments', () => {
    let validPostId: string;
    before(async function createPost() {
      const { statusCode, body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      validPostId = body.data._id;
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).post('/posts/1/comments');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .post('/posts/invalid/comments')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .post(`/posts/${NONEXISTENT_MONGODB_ID}/comments`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Dummy content' });
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 400 if request body is empty', async () => {
      const { statusCode, body } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Please provide content for your comment');
    });

    it('should return 201 if comment is added successfully', async () => {
      const { statusCode, body } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'This is a test comment' });
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Comment created');
      expect(body.data.content).to.equal('This is a test comment');
    });
  });

  //
  // EDIT POST COMMENT
  //

  describe('PATCH /posts/:id/comments/:commentId', () => {
    let validPostId: string;
    let validCommentId: string;
    before(async function createPostWithCommentsAndLikes() {
      const { body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      validPostId = body.data._id;
      // add comments
      const { body: commentBody } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Comment 1' });
      validCommentId = commentBody.data._id;
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).patch(
        '/posts/1/comments/1',
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/invalid/comments/${NONEXISTENT_MONGODB_ID}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Dummy content' });
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 400 if commentId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${validPostId}/comments/invalid`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Dummy content' });
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid comment id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${NONEXISTENT_MONGODB_ID}/comments/${validCommentId}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Dummy content' });
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 404 if comment is not found', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${validPostId}/comments/${NONEXISTENT_MONGODB_ID}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Dummy content' });
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Comment not found');
    });

    it('should return 400 if request body is empty', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${validPostId}/comments/${validCommentId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Please provide content for your comment');
    });

    it('should return 201 if comment is updated successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/posts/${validPostId}/comments/${validCommentId}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Updated test comment' });
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Comment updated');
      expect(body.data.content).to.equal('Updated test comment');
      // check db
      const { statusCode: code, body: res } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(code).to.equal(201);
      expect(res.success).to.be.true;
      expect(res.data.comments).to.be.an('array');
      expect(res.data.comments[0].content).to.equal('Updated test comment');
    });
  });

  //
  // DELETE POST COMMENT
  //

  describe('DELETE /posts/:id/comments/:commentId', () => {
    let validPostId: string;
    let validCommentId: string;
    before(async function createPostWithComments() {
      const { body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      validPostId = body.data._id;
      // add comments
      const { body: commentBody } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Comment 1' });
      validCommentId = commentBody.data._id;
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).delete(
        '/posts/1/comments/1',
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/invalid/comments/${NONEXISTENT_MONGODB_ID}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 400 if commentId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}/comments/invalid`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid comment id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${NONEXISTENT_MONGODB_ID}/comments/${validCommentId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 404 if comment is not found', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}/comments/${NONEXISTENT_MONGODB_ID}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Comment not found');
    });

    it('should return 200 if comment is deleted successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}/comments/${validCommentId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Comment deleted');
      // check db
      const { statusCode: code, body: res } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(code).to.equal(201);
      expect(res.success).to.be.true;
      expect(res.data.comments).to.be.an('array');
      expect(res.data.comments).to.deep.equal([]);
    });
  });

  //
  // LIKE POST COMMENT
  //

  describe('POST /posts/:id/comments/:commentId/like', () => {
    let validPostId: string;
    let validCommentId: string;
    const COMMENT_CONTENT = 'Comment 1';
    const POST_CONTENT = 'Test Post 1';
    before(async function createPostWithComments() {
      const { body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: POST_CONTENT });
      validPostId = body.data._id;
      // add comments
      const { body: commentBody } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: COMMENT_CONTENT });
      validCommentId = commentBody.data._id;
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).post(
        '/posts/1/comments/1/like',
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .post(`/posts/invalid/comments/${NONEXISTENT_MONGODB_ID}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 400 if commentId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .post(`/posts/${validPostId}/comments/invalid/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid comment id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .post(
          `/posts/${NONEXISTENT_MONGODB_ID}/comments/${validCommentId}/like`,
        )
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 404 if comment is not found', async () => {
      const { statusCode, body } = await request(app)
        .post(`/posts/${validPostId}/comments/${NONEXISTENT_MONGODB_ID}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Comment not found');
    });

    it('should return 201 if comment is liked successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .post(`/posts/${validPostId}/comments/${validCommentId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Comment liked');
      // check db
      const { statusCode: code, body: res } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(code).to.equal(201);
      expect(res.success).to.be.true;
      expect(res.data.content).to.equal(POST_CONTENT);
      expect(res.data.comments).to.be.an('array');
      expect(res.data.comments[0].content).to.equal(COMMENT_CONTENT);
      expect(res.data.comments[0].likes).to.be.an('array');
      expect(res.data.comments[0].likes[0]).to.be.an.string;
    });
  });

  //
  // UNLIKE POST COMMENT
  //

  describe('DELETE /posts/:id/comments/:commentId/like', () => {
    let validPostId: string;
    let validCommentId: string;
    before(async function createPostWithComments() {
      const { body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      validPostId = body.data._id;
      // add comments
      const { body: commentBody } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Comment 1' });
      validCommentId = commentBody.data._id;
      // like comment
      await request(app)
        .post(`/posts/${validPostId}/comments/${validCommentId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).delete(
        '/posts/1/comments/1/like',
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if postId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/invalid/comments/${NONEXISTENT_MONGODB_ID}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid post id');
    });

    it('should return 400 if commentId is invalid', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}/comments/invalid/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Invalid comment id');
    });

    it('should return 404 if post is not found', async () => {
      const { statusCode, body } = await request(app)
        .delete(
          `/posts/${NONEXISTENT_MONGODB_ID}/comments/${validCommentId}/like`,
        )
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Post not found');
    });

    it('should return 404 if comment is not found', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}/comments/${NONEXISTENT_MONGODB_ID}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Comment not found');
    });

    it('should return 200 if comment is unliked successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}/comments/${validCommentId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Comment unliked');
      // check db
      const { statusCode: code, body: res } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(code).to.equal(201);
      expect(res.success).to.be.true;
      expect(res.data.comments).to.be.an('array');
      expect(res.data.comments[0].likes).to.be.an('array');
      expect(res.data.comments[0].likes).to.deep.equal([]);
    });
  });
});
