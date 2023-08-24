const errorMessage = 'Unable to get envar value';

// General Config
export const SSP_APP_NAME = process.env.SSP_APP_NAME ?? 'uid2-ssportal';
export const SSP_IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const SSP_IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Loki Config
export const SSP_LOKI_HOST = process.env.SSP_LOKI_HOST ?? 'http://loki:3100';

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
export const SSP_WEB_LOGOUT_URL = process.env.SSP_WEB_LOGOUT_URL ?? 'http://localhost:3000/Logout';

// DB config
export const SSP_DB_HOST = process.env.SSP_DB_HOST ?? 'localhost';
export const SSP_DB_PORT = process.env.SSP_DB_PORT ? +process.env.SSP_DB_PORT : 11433;
export const SSP_DB_USER = process.env.SSP_DB_USER ?? 'sa';
export const SSP_DB_PASSWORD = process.env.SSP_DB_PASSWORD ?? 'D3velopmentP0';
export const SSP_SEND_GRID_API_KEY = process.env.SSP_SEND_GRID_API_KEY ?? '';
export const SSP_EMAIL_SENDER = process.env.SSP_EMAIL_SENDER ?? 'noreply@unifiedid.com';
export const SSP_EMAIL_SENDER_NAME =
  process.env.SSP_EMAIL_SENDER_NAME ?? 'UID2 Service (do not reply)';

export const SSP_ADMIN_SERVICE_BASE_URL =
  process.env.SSP_ADMIN_SERVICE_BASE_URL ?? 'http://localhost:8089';
export const SSP_ADMIN_SERVICE_CLIENT_KEY =
  process.env.SSP_ADMIN_SERVICE_CLIENT_KEY ?? errorMessage;
