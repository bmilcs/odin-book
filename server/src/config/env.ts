import dotenv from 'dotenv';

dotenv.config();

// node environment
export const NODE_ENV = process.env.NODE_ENV ?? 'development';

// ports for client/server
export const SERVER_PORT = process.env.SERVER_PORT ?? 3001;
export const CLIENT_PORT = process.env.CLIENT_PORT ?? 3000;

// database connection string & database names: mongodb atlas
export const MONGO_DB = process.env.MONGO_DB ?? '';
export const PRODUCTION_DB = process.env.PRODUCTION_DB ?? 'production';
export const DEVELOPMENT_DB = process.env.DEVELOPMENT_DB ?? 'development';

// production url: required for CORS
export const PRODUCTION_URL = process.env.PRODUCTION_URL ?? '';

// jwt tokens
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? '';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? '';
export const ACCESS_TOKEN_EXPIRATION =
  process.env.ACCESS_TOKEN_EXPIRATION ?? '15m';
export const REFRESH_TOKEN_EXPIRATION =
  process.env.REFRESH_TOKEN_EXPIRATION ?? '7d';
