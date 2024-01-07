import {
  NONEXISTENT_MONGODB_ID,
  USER_ONE,
  USER_THREE,
  USER_TWO,
  app,
} from '@/tests/setup';
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

    it('should return 201 if post is received with comments & likes', async () => {
      // user 1 create post
      const { body: newPostBody } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'This is a test post' });
      expect(newPostBody.success).to.be.true;
      const validPostId = newPostBody.data._id;
      // user 2 create comment
      const { body: commentBody } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_TWO.jwtCookie)
        .send({ content: 'Comment 1' });
      expect(commentBody.success).to.be.true;
      const validCommentId = commentBody.data._id;
      // user 1 like post
      const { body: likePostBody } = await request(app)
        .post(`/posts/${validPostId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(likePostBody.success).to.be.true;
      // user 2 like comment
      const { body: likeCommentBody } = await request(app)
        .post(`/posts/${validPostId}/comments/${validCommentId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(likeCommentBody.success).to.be.true;
      // user 1 get post
      const { statusCode, body } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post found');
      expect(body.data).to.be.an('object');
      expect(body.data.content).to.equal('This is a test post');
      expect(body.data.likes).to.be.an('array');
      expect(body.data.likes[0]).to.be.an.string;
      expect(body.data.likes[0].user._id).to.equal(USER_ONE._id);
      expect(body.data.comments).to.be.an('array');
      expect(body.data.comments[0]).to.be.an('object');
      expect(body.data.comments[0].content).to.equal('Comment 1');
      expect(body.data.comments[0].likes).to.be.an('array');
      expect(body.data.comments[0].likes[0]).to.be.an.string;
      expect(body.data.comments[0].likes[0].user._id).to.equal(USER_ONE._id);
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
      const { body: postBody } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      expect(postBody.success).to.be.true;
      const validPostId = postBody.data._id;
      expect(validPostId).to.be.a('string');
      // add comments
      const { body: commentBody } = await request(app)
        .post(`/posts/${validPostId}/comments`)
        .set('Cookie', USER_TWO.jwtCookie)
        .send({ content: 'Comment 1' });
      expect(commentBody.success).to.be.true;
      const validCommentId = commentBody.data._id;
      expect(validCommentId).to.be.a('string');
      // delete post
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
      const { body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      expect(body.success).to.be.true;
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
      // like post
      const { statusCode, body } = await request(app)
        .post(`/posts/${validPostId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post liked');
      expect(body.data).to.be.an('object');
      expect(body.data.isLikedByUser).to.be.true;
      expect(body.data.likeCount).to.equal(1);
      // check db
      const { statusCode: code, body: res } = await request(app)
        .get(`/posts/${validPostId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(code).to.equal(201);
      expect(res.success).to.be.true;
      expect(res.data.likes).to.be.an('array');
      expect(res.data.likes[0]).to.be.an.string;
    });

    it('should allow multiple users to like the same post', async () => {
      // User Two likes the post
      const { statusCode: statusCodeOne, body: bodyOne } = await request(app)
        .post(`/posts/${validPostId}/like`)
        .set('Cookie', USER_TWO.jwtCookie);
      expect(statusCodeOne).to.equal(201);
      expect(bodyOne.success).to.be.true;
      expect(bodyOne.message).to.equal('Post liked');
      expect(bodyOne.data).to.be.an('object');
      expect(bodyOne.data.isLikedByUser).to.be.true;
      expect(bodyOne.data.likeCount).to.equal(2);

      // User Three likes the same post
      const { statusCode: statusCodeTwo, body: bodyTwo } = await request(app)
        .post(`/posts/${validPostId}/like`)
        .set('Cookie', USER_THREE.jwtCookie);
      expect(statusCodeTwo).to.equal(201);
      expect(bodyTwo.success).to.be.true;
      expect(bodyTwo.message).to.equal('Post liked');
      expect(bodyTwo.data).to.be.an('object');
      expect(bodyTwo.data.isLikedByUser).to.be.true;
      expect(bodyTwo.data.likeCount).to.equal(3);
    });
  });

  //
  // UNLIKE POST
  //

  describe('DELETE /posts/:id/like', () => {
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

    it('should return 201 if post is unliked successfully', async () => {
      // create post
      const { body: createPostBody } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      const validPostId = createPostBody.data._id;
      // like post
      const { body: likePostBody } = await request(app)
        .post(`/posts/${validPostId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(likePostBody.success).to.be.true;
      // unlike post
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Post unliked');
      expect(body.data).to.be.an('object');
      expect(body.data.isLikedByUser).to.be.false;
      expect(body.data.likeCount).to.equal(0);
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
      const { statusCode, body } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'Original test post' });
      expect(statusCode).to.equal(201);
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

    it('should return 201 if comment is deleted successfully w/ db check', async () => {
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
      expect(res.data.comments[0].likes[0].user._id).to.equal(USER_ONE._id);
    });

    it('should allow multiple users to like the same comment', async () => {
      // User Two likes the comment
      const { statusCode: statusCodeOne, body: bodyOne } = await request(app)
        .post(`/posts/${validPostId}/comments/${validCommentId}/like`)
        .set('Cookie', USER_TWO.jwtCookie);
      expect(statusCodeOne).to.equal(201);
      expect(bodyOne.success).to.be.true;
      expect(bodyOne.message).to.equal('Comment liked');
      expect(bodyOne.data).to.be.an('object');
      expect(bodyOne.data.isLikedByUser).to.be.true;
      expect(bodyOne.data.likeCount).to.equal(2);

      // User Three likes the same comment
      const { statusCode: statusCodeTwo, body: bodyTwo } = await request(app)
        .post(`/posts/${validPostId}/comments/${validCommentId}/like`)
        .set('Cookie', USER_THREE.jwtCookie);
      expect(statusCodeTwo).to.equal(201);
      expect(bodyTwo.success).to.be.true;
      expect(bodyTwo.message).to.equal('Comment liked');
      expect(bodyTwo.data).to.be.an('object');
      expect(bodyTwo.data.isLikedByUser).to.be.true;
      expect(bodyTwo.data.likeCount).to.equal(3);
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

    it('should return 201 if comment is unliked successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/posts/${validPostId}/comments/${validCommentId}/like`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Comment unliked');
      expect(body.data).to.be.an('object');
      expect(body.data.isLikedByUser).to.be.false;
      expect(body.data.likeCount).to.equal(0);
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
