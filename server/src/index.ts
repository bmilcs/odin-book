import { connectDatabase, corsOptions } from '@/config';
import { SERVER_PORT, STORAGE_VOLUME_PATH } from '@/config/env';
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
  jwtCookieHandler,
  responseMethods,
} from '@/middleware';
import {
  authRouter,
  feedRouter,
  friendRouter,
  notificationRouter,
  postRouter,
  usersRouter,
} from '@/routes';
import setupSocketServer from '@/services/socket';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';

//
// setup server
//

const app = express();
const server = http.createServer(app);
setupSocketServer(server);

//
// middleware
//

// compress responses
app.use(compression());

// cors: allow requests from the client
app.use(cors(corsOptions));

// parse incoming data to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// parse cookies: authentication jwt tokens are stored in cookies
app.use(cookieParser());

// allow access to uploaded files
app.use('/uploads', express.static(STORAGE_VOLUME_PATH!));

// helmet: set security headers & protect well-known web vulnerabilities
app.use(helmet());

// adds custom methods to the response object: res.success, res.error, res.addJwtCookies
// .success & .error are used to send responses to the client with a standard format
app.use(responseMethods);

// checks for jwt tokens in cookies and decodes them, adding .userId to req
app.use(jwtCookieHandler);

//
// routes
//

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/friends', friendRouter);
app.use('/posts', postRouter);
app.use('/feed', feedRouter);
app.use('/notifications', notificationRouter);

//
// errors
//

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

//
// start server
//

const startServer = async () => {
  try {
    await connectDatabase();
    server.listen(SERVER_PORT, () => {
      console.log(`> http server started on port: ${SERVER_PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
