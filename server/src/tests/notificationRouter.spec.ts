import { notificationModel } from '@/models';
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

describe('NOTIFICATION ROUTER', () => {
  //
  // GET /notifications
  //

  describe('GET /notifications', () => {
    before(async () => {
      // delete all notifications
      await notificationModel.deleteMany({});

      // send friend request from user two to user one
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
    });

    after(async () => {
      // delete all notifications
      await notificationModel.deleteMany({});
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).get('/notifications');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 201 if notifications are fetched successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .get('/notifications')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Notifications fetched successfully');
      expect(body.data).to.be.an('array');
      expect(body.data.length).to.equal(1);
      expect(body.data[0]).to.have.property('_id');
      expect(body.data[0]).to.have.property('type');
      expect(body.data[0]).to.have.property('fromUser');
      expect(body.data[0]).to.have.property('toUser');
      expect(body.data[0]).to.not.have.property('post');
      expect(body.data[0]).to.have.property('createdAt');
      expect(body.data[0]).to.have.property('updatedAt');
      expect(body.data[0].toUser).to.equal(USER_ONE._id);
      expect(body.data[0].fromUser).to.contain({ _id: USER_TWO._id });
      expect(body.data[0].type).to.equal('incoming_friend_request');
      // check db to make sure notification was created
      const notification = await notificationModel.findOne({
        toUser: USER_ONE._id,
        fromUser: USER_TWO._id,
        type: 'incoming_friend_request',
      });
      expect(notification._id.toString()).to.equal(body.data[0]._id);
      expect(notification.type).to.equal(body.data[0].type);
      expect(notification.fromUser.toString()).to.equal(
        body.data[0].fromUser._id,
      );
      expect(notification.toUser.toString()).to.equal(body.data[0].toUser);
    });
  });

  //
  // GET /notifications/unread
  //

  describe('GET /notifications/unread', () => {
    before(async () => {
      // delete all notifications
      await notificationModel.deleteMany({});
      // send friend request from user two to user one & user three to user one
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_THREE.jwtCookie);
      // ! MARK ONE NOTIFICATION AS READ
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).get('/notifications');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });
  });

  //
  // PUT /notifications/:notificationId/read
  //

  describe('PUT /notifications/:notificationId/read', () => {
    before(async () => {
      // delete all notifications
      await notificationModel.deleteMany({});
      // send friend request from user two to user one
      const res = await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      console.log(res.body);
    });

    after(async () => {
      // delete all notifications
      await notificationModel.deleteMany({});
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).put(
        '/notifications/:notificationId/read',
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if notification ID is invalid', async () => {
      const { statusCode, body } = await request(app)
        .put('/notifications/12345/read')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Notification ID is invalid');
    });

    it('should return 400 if notification ID is nonexistent', async () => {
      const { statusCode, body } = await request(app)
        .put(`/notifications/${NONEXISTENT_MONGODB_ID}/read`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Notification not found');
    });

    it('should return 400 if notification is not for logged in user', async () => {
      const { statusCode, body } = await request(app)
        .put(`/notifications/${USER_ONE._id}/read`)
        .set('Cookie', USER_TWO.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Notification not found');
    });

    it('should return 200 if notification is marked as read successfully', async () => {
      const { body: nBody, status } = await request(app)
        .get('/notifications')
        .set('Cookie', USER_ONE.jwtCookie);
      // TODO
      // ! Ensure read notifications are not returned in GET /notifications
      // ! Ensure user's notification [] is updated
      console.log(nBody);
      const notificationId = nBody.data[0];
      // const { statusCode, body } = await request(app)
      //   .put(`/notifications/${notificationId}/read`)
      //   .set('Cookie', USER_ONE.jwtCookie);
      // expect(statusCode).to.equal(200);
      // expect(body.success).to.be.true;
      // expect(body.message).to.equal('Marked notification as read successfully');
      // expect(body.data).to.be.null;
      // // check db to make sure notification was marked as read
      // const notification = await notificationModel.findById(notificationId);
      // expect(notification.read).to.be.true;
    });
  });

  //
  // PUT /notifications/read-all
  //

  describe('PUT /notifications/read-all', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).put(
        '/notifications/read-all',
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });
  });

  //
  // DELETE /notifications/:notificationId
  //

  describe('DELETE /notifications/:notificationId', () => {
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).delete(
        '/notifications/:notificationId',
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });
  });
});
