import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET,
} from '@/config/env';
import { AppError } from '@/utils';
import { CookieOptions, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export type TAccessTokenPayload = {
  sub: mongoose.Types.ObjectId;
  iat: number;
};

export type TRefreshTokenPayload = {
  sub: mongoose.Types.ObjectId;
  iat: number;
};

// set a jwt httpOnly cookie. this function is applied to the response object as a method
// to be used in the auth controller.

export const setJwtCookies = (
  res: Response,
  userId: mongoose.Types.ObjectId,
) => {
  const accessToken = createAccessTokenPayload(userId);
  const refreshToken = createRefreshTokenPayload(userId);
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  };
  res.cookie('access-token', accessToken, cookieOptions);
  res.cookie('refresh-token', refreshToken, cookieOptions);
};

const createAccessTokenPayload = (userId: mongoose.Types.ObjectId) => {
  if (!ACCESS_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRATION) {
    throw new AppError('ServerError', 500);
  }
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

const createRefreshTokenPayload = (userId: mongoose.Types.ObjectId) => {
  if (!REFRESH_TOKEN_SECRET || !REFRESH_TOKEN_EXPIRATION) {
    throw new AppError('ServerError', 500);
  }
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};
