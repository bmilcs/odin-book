// this file is used to export all the environment variables

export const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT ?? '';
console.log('DEBUG: API_BASE_URL: ', API_BASE_URL);

export const PRODUCTION_DOMAIN =
  (import.meta.env.VITE_PRODUCTION_DOMAIN as string) ?? '';

export const DEVELOPMENT_DOMAIN =
  (import.meta.env.VITE_DEVELOPMENT_DOMAIN as string) ?? 'localhost';

export const CLIENT_MODE = import.meta.env.MODE;
