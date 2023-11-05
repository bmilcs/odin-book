import { userModel } from '@/models';
import { app } from '@/tests/setup';
import { expect } from 'chai';
import { describe } from 'mocha';
import request from 'supertest';

//
// signup
//

describe('POST /auth/signup', () => {
  afterEach(async () => {
    await userModel.deleteMany({});
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
        username: 'adam',
        email: 'adam@jones.com',
        password: 'Aa1sssss!',
        confirmPassword: 'Aa1sssss!!',
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
    const userData = {
      username: 'adam',
      email: 'adam@smith.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    };

    const signupUser = async () =>
      await request(app)
        .post('/auth/signup')
        .send(userData)
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

  it('should create a new user & set jwt cookies', async () => {
    const userData = {
      username: 'adam',
      email: 'adam@smith.com',
    };
    const userPassword = 'Password1!';

    const { body, statusCode, headers } = await request(app)
      .post('/auth/signup')
      .send({
        ...userData,
        confirmPassword: userPassword,
        password: userPassword,
      })
      .expect('Content-Type', /json/);

    // response check: success, userId is valid
    expect(statusCode).equal(200);
    expect(body.success).to.be.true;
    const { username } = body.data;
    expect(username).to.equal(userData.username);

    // database check: user exists and all unique values are unique
    const users = await userModel.find({
      $or: [{ username: userData.username }, { email: userData.email }],
    });
    expect(users).to.have.lengthOf(1);
    expect(users[0]).to.deep.include(userData);
    // password should be hashed
    expect(users[0].password).to.not.equal(userPassword);

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
  const userData = {
    username: 'adam',
    email: 'adam@jones.com',
  };
  const userPassword = 'Password1!';
  const userConfirmPassword = 'Password1!';

  beforeEach(async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        ...userData,
        password: userPassword,
        confirmPassword: userConfirmPassword,
      });
  });

  afterEach(async () => {
    await userModel.deleteMany({});
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
        email: 'adam@jones',
        password: userPassword,
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
        password: userPassword,
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
        email: userData.email,
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
        email: userData.email,
        password: userPassword,
      })
      .expect('Content-Type', /json/);

    // response check: success, userId is valid
    expect(statusCode).equal(200);
    expect(body.success).to.be.true;
    expect(body.message).to.equal('LoginSuccess');
    const { username } = body.data;
    expect(username).to.equal(userData.username);

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
  const userData = {
    username: 'adam',
    email: 'adam@jones.com',
  };
  const userPassword = 'Password1!';
  const userConfirmPassword = 'Password1!';

  beforeEach(async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        ...userData,
        password: userPassword,
        confirmPassword: userConfirmPassword,
      });
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  it('should logout user & clear jwt cookies', async () => {
    const { body, statusCode, headers } = await request(app)
      .post('/auth/logout')
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
