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

    it('should return 400 if username is not found', async () => {
      const { statusCode, body } = await request(app)
        .get('/users/NOT_A_USER')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('User not found');
    });

    it('should return 201 w/ partial user info if username is not a friend of logged in user', async () => {
      const { statusCode, body } = await request(app)
        .get(`/users/${USER_TWO.username}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Partial user info fetched successfully');
      expect(body.data.username).to.equal(USER_TWO.username);
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

  describe('PATCH /profile/', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).patch(
        `/users/${USER_ONE.username}`,
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if user is not profile owner', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/users/${USER_ONE.username}`)
        .set('Cookie', USER_TWO.jwtCookie)
        .send(USER_ONE);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      const errorMessages = body.error.map((e: any) => e.msg);
      expect(errorMessages).to.deep.include(
        'You are not the owner of this profile',
      );
    });

    it('should return 400 if new username is already taken (case insensitive)', async () => {
      const userProfileUpdates = {
        ...USER_ONE,
        username: USER_TWO.username.toUpperCase(),
      };
      const { statusCode, body } = await request(app)
        .patch(`/users/${USER_ONE.username}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send(userProfileUpdates);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      const errorMessages = body.error.map((e: any) => e.msg);
      expect(errorMessages).to.deep.include('Username already in use');
    });

    it('should return 400 if new email is already taken (case insensitive)', async () => {
      const userProfileUpdates = {
        ...USER_ONE,
        email: USER_TWO.email.toUpperCase(),
      };
      const { statusCode, body } = await request(app)
        .patch(`/users/${USER_ONE.username}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send(userProfileUpdates);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      const errorMessages = body.error.map((e: any) => e.msg);
      expect(errorMessages).to.deep.include('Email already in use');
    });

    it('should return 201 w/ updated user profile & db check', async () => {
      const userProfileUpdates = {
        ...USER_ONE,
        username: 'new username',
        email: 'new@email.com',
        bio: 'new bio',
        location: 'new location',
      };
      const { statusCode, body } = await request(app)
        .patch(`/users/${USER_ONE.username}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send(userProfileUpdates);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.data.username).to.equal(userProfileUpdates.username);
      expect(body.data.email).to.equal(userProfileUpdates.email);
      expect(body.data.profile.bio).to.equal('new bio');
      expect(body.data.profile.location).to.equal('new location');
      // check db
      const { statusCode: userStatusCode, body: userBody } = await request(app)
        .get(`/users/${userProfileUpdates.username}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(userStatusCode).to.equal(201);
      expect(userBody.success).to.be.true;
      expect(userBody.data.username).to.equal(userProfileUpdates.username);
      expect(userBody.data.email).to.equal(userProfileUpdates.email);
      expect(userBody.data.profile.bio).to.equal(userProfileUpdates.bio);
      expect(userBody.data.profile.location).to.equal(
        userProfileUpdates.location,
      );
    });
  });

  //
  // UPLOAD PROFILE IMAGE
  //

  describe('PUT /profile/upload-image', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).put(
        `/users/${USER_ONE.username}/upload-profile-image/`,
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if no image is provided', async () => {
      const { statusCode, body } = await request(app)
        .put(`/users/${USER_ONE.username}/upload-profile-image/`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Please provide an image');
    });

    it('should return 201 w/ updated user profile & db check', async () => {
      // const filePath = path.join(__dirname, 'test-image.png');
      // // add keep-alive to header
      // const { statusCode, body } = await request(app)
      //   .put(`/users/${USER_ONE.username}/upload-profile-image`)
      //   .set('Cookie', USER_ONE.jwtCookie)
      //   .attach('file', filePath);
      // expect(statusCode).to.equal(201);
      // expect(body.success).to.be.true;
      // expect(body.data.profile.photo).to.be.a('string');
      // // check db
      // const { statusCode: userStatusCode, body: userBody } = await request(app)
      //   .get(`/users/${USER_ONE.username}`)
      //   .set('Cookie', USER_ONE.jwtCookie);
      // expect(userStatusCode).to.equal(201);
      // expect(userBody.success).to.be.true;
      // expect(userBody.data.profile.photo).to.be.a('string');
    });
  });
});
