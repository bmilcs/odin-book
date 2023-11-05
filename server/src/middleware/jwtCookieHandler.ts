import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '@/config/env';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const jwtCookieHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies['access-token'];
  const refreshToken = req.cookies['refresh-token'];

  // if access token is valid, set userId on request object
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;
      if (decoded.sub) req.userId = decoded.sub;
    } catch (err: any) {
      // if access token is expired, check refresh token
      if (err.name === 'TokenExpiredError' && refreshToken) {
        try {
          // if refresh token is valid, set userId on request object and set new jwt cookies
          const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
          if (decoded.sub) {
            req.userId = decoded.sub;
            res.addJwtCookies(decoded.sub);
          }
        } catch (err) {
          console.error('Error decoding refresh token:', err);
        }
      }
    }
  }

  if (refreshToken && !req.userId) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
      if (decoded.sub) req.userId = decoded.sub;
    } catch (err) {
      console.error('Error decoding refresh token:', err);
    }
  }

  next();
};

export default jwtCookieHandler;
