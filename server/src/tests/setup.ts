import { corsOptions } from '@/config';
import { errorLogger, errorResponder, invalidPathHandler } from '@/middleware';
import { commentModel, likeModel, postModel, userModel } from '@/models';
import {
  feedRouter,
  friendRouter,
  postRouter,
  userProfileRouter,
} from '@/routes';
import authRouter from '@/routes/authRouter';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export const app = express();

app.use(compression());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use('/auth', authRouter);
app.use('/users', userProfileRouter);
app.use('/friends', friendRouter);
app.use('/posts', postRouter);
app.use('/feed', feedRouter);
app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

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

beforeEach(async () => {
  await setupMongoTestServer();
});

afterEach(async () => {
  await teardownMongoTestServer();
});
