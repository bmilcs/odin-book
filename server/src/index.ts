import { connectDatabase, corsOptions } from '@/config';
import { SERVER_PORT } from '@/config/env';
import { errorLogger, errorResponder, invalidPathHandler } from '@/middleware';
import { authRouter, friendRouter, postRouter, userProfileRouter } from '@/routes';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

//
// create an express app
//

const app = express();

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

// helmet: set security headers & protect well-known web vulnerabilities
app.use(helmet());

//
// routes
//

app.use('/auth', authRouter);
app.use('/users', userProfileRouter);
app.use('/friends', friendRouter);
app.use('/posts', postRouter);

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
    app.listen(SERVER_PORT, () => {
      console.log(`> server started on port: ${SERVER_PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
