import {
  USER_ONE,
  USER_TWO,
  app,
  deleteFriendsAndRequestsFromAllTestUsers,
  deleteNotificationsFromAllTestUsers,
} from '@/tests/setup';
import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';

describe('USERS ROUTER', () => {
  //
  // USER SEARCH
  //

  describe('GET /search/:username', () => {
    // users 1-3 are created in the setup file, so we can use them here
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).get('/users/search/1');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if search term is not provided', async () => {
      const { statusCode, body } = await request(app)
        .get('/users/search/')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
    });

    it('should return 200 w/ empty array if no users found', async () => {
      const { statusCode, body } = await request(app)
        .get('/users/search/asdfasdf')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.data).to.have.lengthOf(0);
    });

    //
    // 3 users are created in the setup file, so we can use them here
    // all 3 users have 'user' in their username: userone, usertwo, userthree
    //

    it('should return 201 w/ user if found via username', async () => {
      const { statusCode, body } = await request(app)
        .get(`/users/search/${USER_TWO.username}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.data).to.have.lengthOf(1);
      expect(body.data[0].username).to.equal(USER_TWO.username);
    });

    it('should return 201 w/ user if found via email', async () => {
      const { statusCode, body } = await request(app)
        .get(`/users/search/${USER_TWO.email}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.data).to.have.lengthOf(1);
      expect(body.data[0].username).to.equal(USER_TWO.username);
    });

    it('should return 201 w/ multiple users if found via partial username match', async () => {
      const { statusCode, body } = await request(app)
        .get('/users/search/user')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.data).to.have.lengthOf(3);
    });

    it('should return 201 w/ multiple users if found via partial email match', async () => {
      const { statusCode, body } = await request(app)
        .get('/users/search/@friendlink.com')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.data).to.have.lengthOf(3);
    });
  });

  //
  // GET USER PROFILE
  //

  describe('GET /profile/:username', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).get('/users/1');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });
  });

  it('should return 400 if username is not a friend of logged in user', async () => {
    const { statusCode, body } = await request(app)
      .get(`/users/${USER_TWO.username}`)
      .set('Cookie', USER_ONE.jwtCookie);
    expect(statusCode).to.equal(400);
    expect(body.success).to.be.false;
    expect(body.error).to.equal('You are not friends with this user');
  });

  it('should return 201 w/ user profile if username is a friend of logged in user', async () => {
    // delete all friend requests and friendships
    await deleteFriendsAndRequestsFromAllTestUsers();
    await deleteNotificationsFromAllTestUsers();

    // create friendship between user 1 & 2
    await request(app)
      .post(`/friends/send-request/${USER_TWO._id}`)
      .set('Cookie', USER_ONE.jwtCookie);
    const { statusCode: s, body: b } = await request(app)
      .patch(`/friends/accept-request/${USER_ONE._id}`)
      .set('Cookie', USER_TWO.jwtCookie);
    expect(s).to.equal(200);
    expect(b.success).to.be.true;
    expect(b.message).to.equal('Friend request accepted');

    // get user 2 profile from user 1
    const { statusCode, body } = await request(app)
      .get(`/users/${USER_TWO.username}`)
      .set('Cookie', USER_ONE.jwtCookie);
    expect(statusCode).to.equal(201);
    expect(body.success).to.be.true;
    expect(body.data.username).to.equal(USER_TWO.username);
  });

  it('should return 201 w/ user profile if username is logged in user', async () => {
    const { statusCode, body } = await request(app)
      .get(`/users/${USER_ONE.username}`)
      .set('Cookie', USER_ONE.jwtCookie);
    expect(statusCode).to.equal(201);
    expect(body.success).to.be.true;
    expect(body.data.username).to.equal(USER_ONE.username);
  });
});
