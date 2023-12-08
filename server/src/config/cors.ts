import { CLIENT_PORT, CLIENT_PRODUCTION_URL, NODE_ENV } from '@/config/env';

const corsOrigin =
  NODE_ENV === 'production'
    ? `https://${CLIENT_PRODUCTION_URL}`
    : `http://localhost:${CLIENT_PORT}`;

const corsOptions = {
  origin: corsOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow cookies to be sent from the client to the server
};

export default corsOptions;
