import dotenv from 'dotenv';

dotenv.config();

const errorMessage = 'Unable to get envar value';

// General Config
export const SSP_APP_NAME = process.env.SSP_APP_NAME ?? 'uid2-ssportal';
export const SSP_IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const SSP_IS_DEVELOPMENT = !SSP_IS_PRODUCTION;
export const SERVICE_INSTANCE_ID_PREFIX = process.env.SERVICE_INSTANCE_ID_PREFIX ?? '';

// Keycloak Config
export const SSP_KK_AUDIENCE = process.env.SSP_KK_AUDIENCE ?? errorMessage;
export const SSP_KK_SECRET = process.env.SSP_KK_SECRET ?? errorMessage;
export const SSP_KK_ISSUER_BASE_URL = process.env.SSP_KK_ISSUER_BASE_URL ?? errorMessage;
export const SSP_KK_REALM = process.env.SSP_KK_REALM ?? errorMessage;
export const SSP_KK_AUTH_SERVER_URL = process.env.SSP_KK_AUTH_SERVER_URL ?? errorMessage;
export const SSP_KK_SSL_REQUIRED = process.env.SSP_KK_SSL_REQUIRED ?? errorMessage;
export const SSP_KK_SSL_RESOURCE = process.env.SSP_KK_SSL_RESOURCE ?? errorMessage;
export const SSP_KK_SSL_PUBLIC_CLIENT = process.env.SSP_KK_SSL_PUBLIC_CLIENT ?? errorMessage;
export const SSP_KK_SSL_CONFIDENTIAL_PORT =
  process.env.SSP_KK_SSL_CONFIDENTIAL_PORT ?? errorMessage;
export const SSP_KK_API_CLIENT_ID = process.env.SSP_KK_API_CLIENT_ID ?? errorMessage;
export const SSP_WEB_BASE_URL = process.env.SSP_WEB_BASE_URL ?? 'http://localhost:3000/';
export const SSP_SEND_GRID_API_KEY = process.env.SSP_SEND_GRID_API_KEY ?? '';
export const SSP_EMAIL_SENDER = process.env.SSP_EMAIL_SENDER ?? 'noreply@unifiedid.com';
export const SSP_EMAIL_SENDER_NAME =
  process.env.SSP_EMAIL_SENDER_NAME ?? 'UID2 Service (do not reply)';

// DB config
export const SSP_DB_HOST = process.env.SSP_DB_HOST ?? 'localhost';
export const SSP_DB_PORT = process.env.SSP_DB_PORT ? +process.env.SSP_DB_PORT : 11433;
export const SSP_DB_USER = process.env.SSP_DB_USER ?? 'sa';
export const SSP_DB_PASSWORD = process.env.SSP_DB_PASSWORD ?? 'D3velopmentP0';

// Admin config
export const SSP_OKTA_AUTH_SERVER_URL =
  process.env.SSP_OKTA_AUTH_SERVER_URL ?? 'https://uid2.okta.com/oauth2/aus1oqu660mF7W3hi1d8';
export const SSP_OKTA_CLIENT_ID = process.env.SSP_OKTA_CLIENT_ID ?? '0oa1p0c8howKUR1Yf1d8';
export const SSP_OKTA_CLIENT_SECRET = process.env.SSP_OKTA_CLIENT_SECRET ?? errorMessage;
export const SSP_OKTA_AUTH_DISABLED = process.env.SSP_OKTA_AUTH_DISABLED ?? 'false';
export const SSP_ADMIN_SERVICE_BASE_URL =
  process.env.SSP_ADMIN_SERVICE_BASE_URL ?? 'http://localhost:8089';
