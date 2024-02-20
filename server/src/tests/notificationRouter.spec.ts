import { notificationModel, userModel } from '@/models';
import {
  NONEXISTENT_MONGODB_ID,
  USER_ONE,
  USER_THREE,
  USER_TWO,
  app,
  deleteFriendsAndRequestsFromAllTestUsers,
  deleteNotificationsFromAllTestUsers,
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
      // send friend request from user two to user one
      const { body } = await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      expect(body.success).to.be.true;
    });

    after(async () => {
      await deleteNotificationsFromAllTestUsers();
      await deleteFriendsAndRequestsFromAllTestUsers();
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

    it('should return notification when a friend creates a new post', async () => {
      // send friend request from user 1 to user 3
      const { body: friendRequestBody } = await request(app)
        .post(`/friends/send-request/${USER_THREE._id}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(friendRequestBody.success).to.be.true;
      // accept friend request from user 1 to user 3
      const { body: acceptRequestBody } = await request(app)
        .patch(`/friends/accept-request/${USER_ONE._id}`)
        .set('Cookie', USER_THREE.jwtCookie);
      expect(acceptRequestBody.success).to.be.true;
      // create a new post as user 3
      const { body: postBody } = await request(app)
        .post('/posts')
        .set('Cookie', USER_THREE.jwtCookie)
        .send({ content: 'new post' });
      const postId = postBody.data._id;
      expect(postBody.success).to.be.true;
      // get notifications for user 1
      const { body: notificationBody } = await request(app)
        .get('/notifications')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(notificationBody.success).to.be.true;
      const relevantFields = notificationBody.data.map((n: any) => {
        return {
          type: n.type,
          fromUser: n.fromUser._id.toString(),
          toUser: n.toUser.toString(),
          post: n.post?.toString(),
        };
      });
      expect(relevantFields).to.deep.include({
        type: 'new_post',
        fromUser: USER_THREE._id,
        toUser: USER_ONE._id,
        post: postId,
      });
    });

    it('should return notification when someone comments on your post', async () => {
      // create a new post as user 1
      const { body: postBody } = await request(app)
        .post('/posts')
        .set('Cookie', USER_ONE.jwtCookie)
        .send({ content: 'new post' });
      expect(postBody.success).to.be.true;
      const postId = postBody.data._id;
      // create a new comment on the post as user 2
      const { body: commentBody } = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Cookie', USER_TWO.jwtCookie)
        .send({ content: 'new comment' });
      expect(commentBody.success).to.be.true;
      // get notifications for user 1
      const { body: notificationBody } = await request(app)
        .get('/notifications')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(notificationBody.success).to.be.true;
      const relevantFields = notificationBody.data.map((n: any) => {
        return {
          type: n.type,
          fromUser: n.fromUser._id.toString(),
          toUser: n.toUser.toString(),
          post: n.post?.toString(),
        };
      });
      expect(relevantFields).to.deep.include({
        type: 'new_comment',
        fromUser: USER_TWO._id,
        toUser: USER_ONE._id,
        post: postBody.data._id,
      });
    });
  });

  //
  // GET /notifications/unread
  //

  describe('GET /notifications/unread', () => {
    before(async () => {
      await deleteNotificationsFromAllTestUsers();
      // send friend requests to user one from user two/three
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_THREE.jwtCookie);
      // get id of a single notification
      const { body: nBody } = await request(app)
        .get('/notifications')
        .set('Cookie', USER_ONE.jwtCookie);
      const notificationId = nBody.data[0]._id.toString();
      // mark one of the notifications as read
      await request(app)
        .put(`/notifications/${notificationId}/read`)
        .set('Cookie', USER_ONE.jwtCookie);
    });

    after(async () => {
      await deleteNotificationsFromAllTestUsers();
      await deleteFriendsAndRequestsFromAllTestUsers();
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).get('/notifications');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 201 if unread notifications are fetched successfully w/ db check', async () => {
      const { statusCode, body } = await request(app)
        .get('/notifications/unread')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal(
        'Unread notifications fetched successfully',
      );
      expect(body.data).to.be.an('array');
      expect(body.data.length).to.equal(1);
      expect(body.data[0]).to.have.property('_id');
      expect(body.data[0]).to.have.property('type');
      expect(body.data[0]).to.have.property('fromUser');
      expect(body.data[0]).to.have.property('toUser');
      expect(body.data[0]).to.not.have.property('post');
      expect(body.data[0]).to.have.property('createdAt');
      expect(body.data[0]).to.have.property('updatedAt');
      expect(body.data[0].read).to.be.false;
      expect(body.data[0].toUser).to.equal(USER_ONE._id);
      expect(body.data[0].fromUser).to.contain({ _id: USER_THREE._id });
      expect(body.data[0].type).to.equal('incoming_friend_request');
    });
  });

  //
  // PUT /notifications/:notificationId/read
  //

  describe('PUT /notifications/:notificationId/read', () => {
    before(async () => {
      await deleteFriendsAndRequestsFromAllTestUsers();
      await deleteNotificationsFromAllTestUsers();
      // send friend request from user one to user two
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
    });

    after(async () => {
      await deleteNotificationsFromAllTestUsers();
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
      const { body: nBody } = await request(app)
        .get('/notifications')
        .set('Cookie', USER_ONE.jwtCookie);
      const notificationId = nBody.data[0]._id.toString();

      const { statusCode, body } = await request(app)
        .put(`/notifications/${notificationId}/read`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Marked notification as read successfully');
      expect(body.data).to.be.null;

      // check db to make sure notification was marked as read
      const notification = await notificationModel.findById(notificationId);
      expect(notification.read).to.be.true;

      // check db to make sure user's notifications [] was updated
      const user = await userModel
        .findById(USER_ONE._id)
        .populate('notifications');
      expect(user.notifications.length).to.equal(1);
      expect(user.notifications[0].read).to.be.true;
    });
  });

  //
  // PUT /notifications/read-all
  //

  describe('PUT /notifications/read-all', () => {
    before(async () => {
      await deleteFriendsAndRequestsFromAllTestUsers();
      await deleteNotificationsFromAllTestUsers();
      // send friend request to user one from two/three
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_THREE.jwtCookie);
    });

    after(async () => {
      await deleteNotificationsFromAllTestUsers();
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).put(
        '/notifications/read-all',
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 200 if all notifications are marked as read successfully', async () => {
      const { statusCode, body } = await request(app)
        .put('/notifications/read-all')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal(
        'Marked all notifications as read successfully',
      );
      expect(body.data).to.be.null;

      // check db to make sure notifications were marked as read
      const notifications = await notificationModel.find({
        toUser: USER_ONE._id,
      });
      expect(notifications.length).to.equal(2);
      expect(notifications[0].read).to.be.true;
      expect(notifications[1].read).to.be.true;

      // check db to make sure user's notifications [] was updated
      const user = await userModel
        .findById(USER_ONE._id)
        .populate('notifications');
      expect(user.notifications.length).to.equal(2);
      expect(user.notifications[0].read).to.be.true;
      expect(user.notifications[1].read).to.be.true;
    });
  });

  //
  // DELETE /notifications/:notificationId
  //

  describe('DELETE /notifications/:notificationId', () => {
    let notificationId: string;

    before(async () => {
      await deleteFriendsAndRequestsFromAllTestUsers();
      await deleteNotificationsFromAllTestUsers();
      // send friend request from user one to user two
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
      // get id of a single notification
      const { body: nBody } = await request(app)
        .get('/notifications')
        .set('Cookie', USER_ONE.jwtCookie);
      notificationId = nBody.data[0]._id.toString();
    });

    after(async () => {
      await deleteNotificationsFromAllTestUsers();
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).delete(
        '/notifications/:notificationId',
      );
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 400 if notification ID is invalid', async () => {
      const { statusCode, body } = await request(app)
        .delete('/notifications/12345')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Notification ID is invalid');
    });

    it('should return 400 if notification ID is nonexistent', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/notifications/${NONEXISTENT_MONGODB_ID}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Notification not found');
    });

    it('should return 400 if notification is not for logged in user', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/notifications/${notificationId}`)
        .set('Cookie', USER_TWO.jwtCookie);
      expect(statusCode).to.equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Notification not found');
    });

    it('should return 200 if notification is deleted successfully', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/notifications/${notificationId}`)
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Deleted notification successfully');
      expect(body.data).to.be.null;

      // check db to make sure notification was deleted
      const notification = await notificationModel.findById(notificationId);
      expect(notification).to.be.null;

      // check db to make sure user's notifications [] was updated
      const user = await userModel
        .findById(USER_ONE._id)
        .populate('notifications');
      expect(user.notifications.length).to.equal(0);
    });
  });

  //
  // DELETE /notifications
  //

  describe('DELETE /notifications', () => {
    before(async () => {
      await deleteFriendsAndRequestsFromAllTestUsers();
      await deleteNotificationsFromAllTestUsers();
      // send friend request from user one to user two
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).delete('/notifications');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 200 if all notifications are deleted successfully', async () => {
      const { statusCode, body } = await request(app)
        .delete('/notifications')
        .set('Cookie', USER_ONE.jwtCookie);
      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Deleted all notifications successfully');
      expect(body.data).to.be.null;
      // check db to make sure notifications were deleted
      const notifications = await notificationModel.find({
        toUser: USER_ONE._id,
      });
      expect(notifications.length).to.equal(0);
      // check db to make sure user's notifications [] was updated
      const user = await userModel
        .findById(USER_ONE._id)
        .populate('notifications');
      expect(user.notifications.length).to.equal(0);
    });
  });

  //
  // DELETE /notifications/all
  //

  describe('DELETE /notifications/all', () => {
    before(async () => {
      await deleteFriendsAndRequestsFromAllTestUsers();
      await deleteNotificationsFromAllTestUsers();
      // send friend request from user one to user two
      await request(app)
        .post(`/friends/send-request/${USER_ONE._id}`)
        .set('Cookie', USER_TWO.jwtCookie);
    });

    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app).delete('/notifications');
      expect(statusCode).to.equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should return 200 if all notifications are deleted successfully', async () => {
      const { statusCode, body } = await request(app)
        .delete('/notifications')
        .set('Cookie', USER_ONE.jwtCookie);
      console.log(body);

      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('Deleted all notifications successfully');
      expect(body.data).to.be.null;
      // check db to make sure notifications were deleted
      const notifications = await notificationModel.find({
        toUser: USER_ONE._id,
      });
      expect(notifications.length).to.equal(0);
      // check db to make sure user's notifications [] was updated
      const user = await userModel
        .findById(USER_ONE._id)
        .populate('notifications');
      expect(user.notifications.length).to.equal(0);
    });
  });
});
