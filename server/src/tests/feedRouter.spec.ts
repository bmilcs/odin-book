import { USER_ONE, USER_TWO, app } from '@/tests/setup';
import { expect } from 'chai';
import request from 'supertest';

describe('FEED ROUTER', () => {
  describe('GET /feed', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).get('/feed').send({});
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 200 with feed data if user is logged in w/ db check', async () => {
      // send friend request from user one to user two
      await request(app)
        .post(`/friends/send-request/${USER_TWO._id}`)
        .set('Cookie', USER_ONE.jwtCookie);
      // accept friend request from user two to user one
      await request(app)
        .patch(`/friends/accept-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      // create posts for both users
      const createPost = async (user: any, content: string) => {
        await request(app)
          .post('/posts')
          .set('Cookie', user.jwtCookie)
          .send({ content });
      };
      const USER_ONE_POSTS = ['user one post 1', 'user one post 2'];
      const USER_TWO_POSTS = ['user two post 1', 'user two post 2'];
      await createPost(USER_ONE, USER_ONE_POSTS[0]);
      await createPost(USER_TWO, USER_TWO_POSTS[0]);
      await createPost(USER_ONE, USER_ONE_POSTS[1]);
      await createPost(USER_TWO, USER_TWO_POSTS[1]);
      // get feed for user one
      const { statusCode, body } = await request(app)
        .get('/feed')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.data).to.be.an('array');
      expect(body.data.length).to.equal(4);
      // check that feed is in correct order
      const feed = body.data;
      expect(feed[0].content).to.equal(USER_TWO_POSTS[1]);
      expect(feed[1].content).to.equal(USER_ONE_POSTS[1]);
      expect(feed[2].content).to.equal(USER_TWO_POSTS[0]);
      expect(feed[3].content).to.equal(USER_ONE_POSTS[0]);
      // get feed for user two
      const { statusCode: statusCode2, body: body2 } = await request(app)
        .get('/feed')
        .set('Cookie', USER_TWO.jwtCookie);
      expect(statusCode2).to.equal(200);
      expect(body2.success).to.be.true;
      expect(body2.data).to.be.an('array');
      expect(body2.data.length).to.equal(4);
      // check that feed is in correct order
      const feed2 = body2.data;
      expect(feed2[0].content).to.equal(USER_TWO_POSTS[1]);
      expect(feed2[1].content).to.equal(USER_ONE_POSTS[1]);
      expect(feed2[2].content).to.equal(USER_TWO_POSTS[0]);
      expect(feed2[3].content).to.equal(USER_ONE_POSTS[0]);
    });
  });
});
