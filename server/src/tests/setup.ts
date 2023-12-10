import { corsOptions } from '@/config';
import {
  errorResponder,
  invalidPathHandler,
  jwtCookieHandler,
  responseMethods,
} from '@/middleware';
import { commentModel, likeModel, postModel, userModel } from '@/models';
import {
  authRouter,
  feedRouter,
  friendRouter,
  postRouter,
  usersRouter,
} from '@/routes';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

// index.d.ts
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
    interface Response {
      success: (message: string, data?: any, statusCode?: number) => void;
      error: (message: string, error?: any, statusCode?: number) => void;
      addJwtCookies: (userId: mongoose.Types.ObjectId) => void;
    }
  }
}

// setup server
export const app = express();

app.use(compression());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(responseMethods);
app.use(jwtCookieHandler);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/friends', friendRouter);
app.use('/posts', postRouter);
app.use('/feed', feedRouter);
app.use(errorResponder);
app.use(invalidPathHandler);

// disable logging
app.set('env', 'test');

//
// database connection
//

let mongoServer: MongoMemoryServer;

const mongodbMemoryServerOptions = {
  binary: {
    version: '6.0.6',
    skipMD5: true,
  },
  autoStart: false,
  instance: {},
};

const setupMongoTestServer = async () => {
  try {
    mongoServer = await MongoMemoryServer.create(mongodbMemoryServerOptions);
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    mongoose.model('Comment', commentModel.schema);
    mongoose.model('Like', likeModel.schema);
    mongoose.model('Post', postModel.schema);
    mongoose.model('User', userModel.schema);

    mongoose.connection.on('error', (e) => {
      console.error('MongoDB Connection Error:', e);
    });
  } catch (error) {
    console.error('Error setting up MongoDB test server:', error);
  }
};

const teardownMongoTestServer = async () => {
  try {
    await mongoose.disconnect();
    await mongoServer.stop();
  } catch (error) {
    console.error('Error tearing down MongoDB test server:', error);
  }
};

before(async () => {
  await setupMongoTestServer();
});

after(async () => {
  await teardownMongoTestServer();
});

//
// create 3 test users
//

export const USER_ONE = {
  email: 'userone@friendlink.com',
  password: 'passworD1!',
  confirmPassword: 'passworD1!',
  username: 'userone',
  jwtCookie: '',
  _id: '',
};

export const USER_TWO = {
  email: 'usertwo@friendlink.com',
  password: 'passworD2!',
  confirmPassword: 'passworD2!',
  username: 'usertwo',
  jwtCookie: '',
  _id: '',
};

export const USER_THREE = {
  email: 'userthree@friendlink.com',
  password: 'passworD3!',
  confirmPassword: 'passworD3!',
  username: 'userthree',
  jwtCookie: '',
  _id: '',
};

before(async function signupUsersAndSaveUserOneJWTCookies() {
  const users = [USER_ONE, USER_TWO, USER_THREE];

  for (const user of users) {
    const { body, header } = await request(app)
      .post('/auth/signup')
      .send({
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
        username: user.username,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    user._id = body.data._id;
    user.jwtCookie = header['set-cookie'][0];
  }
});

export const NONEXISTENT_MONGODB_ID = '111111111111111111111111';
