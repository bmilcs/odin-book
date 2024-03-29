import { userModel } from '@/models';
import { app } from '@/tests/setup';
import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';

const AUTH_USER = {
  username: 'adam',
  email: 'adam@smith.com',
  password: 'Password1!',
  confirmPassword: 'Password1!',
};

const AUTH_USER_UPPERCASE = {
  ...AUTH_USER,
  username: AUTH_USER.username.toUpperCase(),
  email: AUTH_USER.email.toUpperCase(),
};

describe('AUTH ROUTER', () => {
  //
  // signup
  //

  describe('POST /auth/signup', () => {
    afterEach(async () => {
      await userModel.deleteMany({
        username: new RegExp(AUTH_USER.username, 'i'),
      });
    });

    it('should validate signup data (empty inputs)', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/signup')
        .send({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.be.an('array');
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = [
        'Username must be between 3 and 50 characters',
        'Email must be valid',
        'Password must be between 8 and 50 characters',
      ];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should validate signup data (mismatched passwords)', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/signup')
        .send({
          ...AUTH_USER,
          password: 'notMatch1!a@A',
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      expect(body.error).to.be.an('array');
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = ['Passwords must match'];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should validate signup data (duplicate email / username)', async () => {
      const signupUser = async () =>
        await request(app)
          .post('/auth/signup')
          .send(AUTH_USER)
          .expect('Content-Type', /json/);
      await signupUser();
      const { body, statusCode } = await signupUser();
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = [
        'Username already in use',
        'Email already in use',
      ];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should validate duplicate email / username (case-insensitive)', async () => {
      const { body: initialSignupBody } = await request(app)
        .post('/auth/signup')
        .send(AUTH_USER)
        .expect('Content-Type', /json/);
      expect(initialSignupBody.success).to.be.true;
      const { body, statusCode } = await request(app)
        .post('/auth/signup')
        .send(AUTH_USER_UPPERCASE)
        .expect('Content-Type', /json/);
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = [
        'Username already in use',
        'Email already in use',
      ];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should validate password requirements: 8-50 characters', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/signup')
        .send({
          ...AUTH_USER,
          password: 'short',
          confirmPassword: 'short',
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = [
        'Password must be between 8 and 50 characters',
      ];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should validate password requirements: 1 uppercase letter', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/signup')
        .send({
          ...AUTH_USER,
          password: '!asdfasdf1',
          confirmPassword: '!asdfasdf1',
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = [
        'Password must contain 1 uppercase letter, number & special character',
      ];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should validate password requirements: 1 number', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/signup')
        .send({
          ...AUTH_USER,
          password: '!asdfasdF',
          confirmPassword: '!asdfasdF',
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = [
        'Password must contain 1 uppercase letter, number & special character',
      ];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should validate password requirements: 1 special character', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/signup')
        .send({
          ...AUTH_USER,
          password: '1asdfasdF',
          confirmPassword: '1asdfasdF',
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = [
        'Password must contain 1 uppercase letter, number & special character',
      ];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should create a new user & set jwt cookies', async () => {
      const { body, statusCode, headers } = await request(app)
        .post('/auth/signup')
        .send(AUTH_USER)
        .expect('Content-Type', /json/);
      // response check: success, userId is valid
      expect(statusCode).equal(201);
      expect(body.success).to.be.true;
      const { username } = body.data;
      expect(username).to.equal(AUTH_USER.username);
      // database check: user exists and all unique values are unique
      const users = await userModel.find({
        $or: [{ username: AUTH_USER.username }, { email: AUTH_USER.email }],
      });
      expect(users).to.have.lengthOf(1);
      // password should be hashed
      expect(users[0].password).to.not.equal(AUTH_USER.password);
      // cookie check: jwt cookie is set
      const cookies = headers['set-cookie'];
      expect(cookies).to.have.lengthOf(2);
      expect(cookies[0]).to.match(/^access-token=.+/);
      expect(cookies[1]).to.match(/^refresh-token=.+/);
    });
  });

  //
  // login
  //

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/auth/signup').send(AUTH_USER);
    });

    afterEach(async () => {
      await userModel.deleteOne({ username: AUTH_USER.username });
    });

    it('should validate login data (empty inputs)', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/login')
        .send({
          email: '',
          password: '',
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      expect(body.message).to.equal('ValidationError');
      expect(body.error).to.be.an('array');
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = [
        'Email must be valid',
        'Password must be provided',
      ];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should validate login data (invalid email)', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/login')
        .send({
          email: 'invalidemail',
          password: AUTH_USER.password,
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(400);
      expect(body.success).to.be.false;
      expect(body.message).to.equal('ValidationError');
      expect(body.error).to.be.an('array');
      const errorMsgs = body.error.map((error: any) => error.msg);
      const expectedErrorMsgs = ['Email must be valid'];
      expect(errorMsgs).to.deep.equal(expectedErrorMsgs);
    });

    it('should validate login data (incorrect email)', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/login')
        .send({
          email: 'notreal@email.com',
          password: AUTH_USER.password,
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(401);
      expect(body.success).to.be.false;
      expect(body.message).to.equal('LoginError');
      expect(body.error).to.equal('Invalid email or password');
    });

    it('should validate login data (incorrect password)', async () => {
      const { body, statusCode } = await request(app)
        .post('/auth/login')
        .send({
          email: AUTH_USER.email,
          password: 'incorrectPassword1!',
        })
        .expect('Content-Type', /json/);
      expect(statusCode).equal(401);
      expect(body.success).to.be.false;
      expect(body.message).to.equal('LoginError');
      expect(body.error).to.equal('Invalid email or password');
    });

    it('should login user & set jwt cookies', async () => {
      const { body, statusCode, headers } = await request(app)
        .post('/auth/login')
        .send({
          email: AUTH_USER.email,
          password: AUTH_USER.password,
        })
        .expect('Content-Type', /json/);
      // response check: success, userId is valid
      expect(statusCode).equal(201);
      expect(body.success).to.be.true;
      expect(body.message).to.equal('LoginSuccess');
      const { username } = body.data;
      expect(username).to.equal(AUTH_USER.username);
      expect(body.data).to.include.all.keys(
        'username',
        'email',
        '_id',
        'friends',
        'friendRequestsSent',
        'friendRequestsReceived',
        'notifications',
        'profile',
      );
      // cookie check: jwt cookie is set
      const cookies = headers['set-cookie'];
      expect(cookies).to.have.lengthOf(2);
      expect(cookies[0]).to.match(/^access-token=.+/);
      expect(cookies[1]).to.match(/^refresh-token=.+/);
    });
  });

  //
  // logout
  //

  describe('POST /auth/logout', () => {
    after(async () => {
      await userModel.deleteOne({ username: AUTH_USER.username });
    });
    it('should return 401 if user is not logged in', async () => {
      const { statusCode, body } = await request(app)
        .post('/auth/logout')
        .send({})
        .expect('Content-Type', /json/);
      expect(statusCode).equal(401);
      expect(body.success).to.be.false;
      expect(body.error).to.equal('Unauthorized');
    });

    it('should logout user & clear jwt cookies', async () => {
      const res = await request(app).post('/auth/signup').send(AUTH_USER);
      const jwtCookie = res.headers['set-cookie'][0];
      const { body, statusCode, headers } = await request(app)
        .post('/auth/logout')
        .set('Cookie', jwtCookie)
        .expect('Content-Type', /json/);
      // response check: success, userId is valid
      expect(statusCode).equal(200);
      expect(body.success).to.be.true;
      expect(body.data).to.be.null;
      // cookie check: jwt cookie is set
      const cookies = headers['set-cookie'];
      expect(cookies).to.have.lengthOf(2);
      expect(cookies[0]).to.match(/^access-token=;/);
      expect(cookies[1]).to.match(/^refresh-token=;/);
    });
  });

  //
  // auth status
  //

  describe('GET /auth/status', () => {
    after(async () => {
      await userModel.deleteOne({ username: AUTH_USER.username });
    });

    it("should return the user's auth status: false", async () => {
      const { body, statusCode } = await request(app)
        .get('/auth/status')
        .expect('Content-Type', /json/);
      expect(statusCode).equal(200);
      expect(body.message).to.equal('Not authenticated');
      expect(body.success).to.be.true;
      expect(body.data).to.be.null;
    });

    it("should return the user's auth status: true", async () => {
      const res = await request(app).post('/auth/signup').send(AUTH_USER);
      const jwtCookie = res.headers['set-cookie'][0];
      const statusRes = await request(app)
        .get('/auth/status')
        .set('Cookie', jwtCookie);
      expect(statusRes.statusCode).equal(201);
      expect(statusRes.body.message).to.equal('Authenticated');
      expect(statusRes.body.success).to.be.true;
      expect(statusRes.body.data).to.deep.include({
        username: AUTH_USER.username,
        email: AUTH_USER.email,
      });
      expect(statusRes.body.data).to.contain.all.keys(
        'username',
        'email',
        '_id',
        'friends',
        'friendRequestsSent',
        'friendRequestsReceived',
      );
    });
  });
});
