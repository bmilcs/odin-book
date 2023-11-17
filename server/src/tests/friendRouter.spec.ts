import { userModel } from '@/models';
import { USER_ONE, USER_TWO, app } from '@/tests/setup';
import { expect } from 'chai';
import request from 'supertest';

describe('FRIEND ROUTER', () => {
  afterEach(async function clearAllFriendRequests() {
    try {
      await userModel.updateMany(
        {},
        {
          $set: {
            friends: [],
            friendRequestsSent: [],
            friendRequestsReceived: [],
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  });

  //
  // SEND FRIEND REQUEST
  //

  describe('POST /send-request', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app)
        .post('/friends/send-request/1')
        .send({});
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 404 if friend Id is not provided', async () => {
      const { statusCode, body } = await request(app)
        .post('/friends/send-request/')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});
      expect(statusCode).to.equal(404);
      expect(body.success).to.be.false;
    });

    it('should return 400 if user is sending a friend request to themselves', async () => {
      const { statusCode, body } = await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Cannot send friend request to yourself');
    });

    it('should return 400 if friend Id is invalid', async () => {
      const invalidMongoID = '1';
      const { statusCode, body } = await request(app)
        .post(`/friends/send-request/${invalidMongoID}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Friend user ID is invalid');
    });

    it('should return 400 if friend Id is not found', async () => {
      const nonexistentMongoID = '111111111111111111111111';
      const { statusCode, body } = await request(app)
        .post(`/friends/send-request/${nonexistentMongoID}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('User not found');
    });

    it('should send a friend request w/ database checks', async () => {
      const { statusCode, body } = await request(app)
        .post(`/friends/send-request/${USER_TWO._id}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Friend request sent');
      // check that both user models received the friend request
      const userOne = await userModel.findById(USER_ONE._id);
      const userTwo = await userModel.findById(USER_TWO._id);
      expect(userOne?.friendRequestsSent).to.have.lengthOf(1);
      expect(userTwo?.friendRequestsReceived).to.have.lengthOf(1);
      expect(userOne?.friendRequestsSent[0].toString()).to.equal(
        userTwo?._id.toString(),
      );
      expect(userTwo?.friendRequestsReceived[0].toString()).to.equal(
        userOne?._id.toString(),
      );
    });
  });

  //
  // ACCEPT FRIEND REQUEST
  //

  describe('PATCH /accept-request/:userId', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app)
        .patch('/friends/accept-request/1')
        .send({});
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if friend id is invalid', async () => {
      const { statusCode, body } = await request(app)
        .patch('/friends/accept-request/1')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Friend user ID is invalid');
    });

    it('should return 400 if friend id is not found', async () => {
      const nonexistentMongoID = '111111111111111111111111';
      const { statusCode, body } = await request(app)
        .patch(`/friends/accept-request/${nonexistentMongoID}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});

      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('User not found');
    });

    it('should return 400 if friend request is not found', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/friends/accept-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie)
        .send({});
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Friend request not found');
    });

    it('should accept a friend request w/ database checks', async () => {
      // send a friend request from USER_ONE to USER_TWO
      await request(app)
        .post(`/friends/send-request/${USER_TWO._id}`)
        .set('Cookie', USER_ONE.jwtCookie);

      const { statusCode, body } = await request(app)
        .patch(`/friends/accept-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Friend request accepted');
      // check that both user models received the friend request
      const userOne = await userModel.findById(USER_ONE._id);
      const userTwo = await userModel.findById(USER_TWO._id);
      expect(userOne?.friends).to.have.lengthOf(1);
      expect(userTwo?.friends).to.have.lengthOf(1);
      expect(userOne?.friends[0].toString()).to.equal(userTwo?._id.toString());
      expect(userTwo?.friends[0].toString()).to.equal(userOne?._id.toString());
      expect(userOne?.friendRequestsSent).to.have.lengthOf(0);
      expect(userTwo?.friendRequestsReceived).to.have.lengthOf(0);
    });
  });

  //
  // REJECT FRIEND REQUEST
  //

  describe('PATCH /reject-request/:userId', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app)
        .patch('/friends/reject-request/1')
        .send({});
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if friend id is invalid', async () => {
      const { statusCode, body } = await request(app)
        .patch('/friends/reject-request/1')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Friend user ID is invalid');
    });

    it('should return 400 if friend id is not found', async () => {
      const nonexistentMongoID = '111111111111111111111111';
      const { statusCode, body } = await request(app)
        .patch(`/friends/reject-request/${nonexistentMongoID}`)
        .set('Cookie', USER_ONE.jwtCookie)
        .send({});

      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('User not found');
    });

    it('should return 400 if friend request is not found', async () => {
      const { statusCode, body } = await request(app)
        .patch(`/friends/reject-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie)
        .send({});
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Friend request not found');
    });

    it('should reject a friend request w/ database checks', async () => {
      // send a friend request from USER_ONE to USER_TWO
      await request(app)
        .post(`/friends/send-request/${USER_TWO._id}`)
        .set('Cookie', USER_ONE.jwtCookie);

      const { statusCode, body } = await request(app)
        .patch(`/friends/reject-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Friend request rejected');
      // check that both user models received the friend request
      const userOne = await userModel.findById(USER_ONE._id);
      const userTwo = await userModel.findById(USER_TWO._id);
      expect(userOne?.friendRequestsSent).to.have.lengthOf(0);
      expect(userTwo?.friendRequestsReceived).to.have.lengthOf(0);
    });
  });

  //
  // DELETE FRIEND
  //

  describe('DELETE /:userId', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).delete('/friends/1');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if friend id is invalid', async () => {
      const { statusCode, body } = await request(app)
        .delete('/friends/1')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Friend user ID is invalid');
    });

    it('should return 400 if friend id is not found', async () => {
      const nonexistentMongoID = '111111111111111111111111';
      const { statusCode, body } = await request(app)
        .delete(`/friends/${nonexistentMongoID}`)
        .set('Cookie', USER_ONE.jwtCookie);

      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('User not found');
    });

    it('should return 400 if friend is not found', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/friends/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);

      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Friend not found');
    });

    it('should delete a friend w/ database checks', async () => {
      // send a friend request from USER_ONE to USER_TWO
      await request(app)
        .post(`/friends/send-request/${USER_TWO._id}`)
        .set('Cookie', USER_ONE.jwtCookie);
      // accept the friend request
      await request(app)
        .patch(`/friends/accept-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);

      const { statusCode, body } = await request(app)
        .delete(`/friends/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Friend deleted');
      // check that both user models received the friend request
      const userOne = await userModel.findById(USER_ONE._id);
      const userTwo = await userModel.findById(USER_TWO._id);
      expect(userOne?.friends).to.have.lengthOf(0);
      expect(userTwo?.friends).to.have.lengthOf(0);
    });
  });
});
