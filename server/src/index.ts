import { connectDatabase, corsOptions } from '@/config';
import { SERVER_PORT } from '@/config/env';
import { errorLogger, errorResponder, handleValidationErrors, invalidPathHandler } from '@/middleware';
import { AppError, tryCatch } from '@/utils';
import { validateField } from '@/validation';
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

const getUser = async () => undefined;

app.get(
  '/test',
  tryCatch(async (req, res) => {
    const user = await getUser();
    if (!user) {
      throw new AppError('User not found', 999);
    }
    res.status(200).json({ user });
  }),
);

app.post(
  '/login',
  validateField.email(),
  handleValidationErrors,
  tryCatch(async (req, res, next) => {
    res.status(200).json('cheers');
  }),
);

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
