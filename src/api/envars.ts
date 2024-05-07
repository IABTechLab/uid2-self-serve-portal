const errorMessage = 'Unable to get envar value';

// General Config
export const SSP_APP_NAME = process.env.SSP_APP_NAME ?? 'uid2-ssportal';
export const SSP_IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const SSP_IS_DEVELOPMENT = !SSP_IS_PRODUCTION;

// Loki Config
export const SSP_LOKI_HOST = process.env.SSP_LOKI_HOST ?? 'http://loki:3100';

// Agent Config
export const AGENT_CONFIG_FILE =
  process.env.AGENT_CONFIG_FILE ?? `${errorMessage}AGENT_CONFIG_FILE`;
export const AGENT_CONFIG_PATH =
  process.env.AGENT_CONFIG_PATH ?? `${errorMessage}AGENT_CONFIG_PATH`;
export const AGENT_CONFIG_PATH_LOCAL =
  process.env.AGENT_CONFIG_PATH_LOCAL ?? `${errorMessage}AGENT_CONFIG_PATH_LOCAL`;
export const AGENT_KEY_APP_RECEIVER =
  process.env.AGENT_KEY_APP_RECEIVER ?? `${errorMessage}AGENT_KEY_APP_RECEIVER`;
export const AGENT_HOST = process.env.AGENT_HOST ?? `${errorMessage}AGENT_HOST`;
export const AGENT_LOGS_PATH = process.env.AGENT_LOGS_PATH ?? `${errorMessage}AGENT_LOGS_PATH`;
export const AGENT_PORT = process.env.AGENT_PORT ?? `${errorMessage}AGENT_PORT`;
export const AGENT_PORT_APP_RECEIVER =
  process.env.AGENT_PORT_APP_RECEIVER ?? `${errorMessage}AGENT_PORT_APP_RECEIVER`;
export const AGENT_TEMP_PATH = process.env.AGENT_TEMP_PATH ?? `${errorMessage}AGENT_TEMP_PATH`;
export const AGENT_WAL_PATH = process.env.AGENT_WAL_PATH ?? `${errorMessage}AGENT_WAL_PATH`;

// Faro Config
export const CLIENT_PACKAGE_NAME =
  process.env.CLIENT_PACKAGE_NAME ?? `${errorMessage}CLIENT_PACKAGE_NAME`;
export const PACKAGE_VERSION = process.env.PACKAGE_VERSION ?? `${errorMessage}PACKAGE_VERSION`;
export const SERVER_AGENT_HOST =
  process.env.SERVER_AGENT_HOST ?? `${errorMessage}SERVER_AGENT_HOST`;
export const SERVER_LOGS_NAME = process.env.SERVER_LOGS_NAME ?? `${errorMessage}SERVER_LOGS_NAME`;
export const SERVER_LOGS_PATH = process.env.SERVER_LOGS_PATH ?? `${errorMessage}SERVER_LOGS_PATH`;
export const SERVER_PACKAGE_NAME =
  process.env.SERVER_PACKAGE_NAME ?? `${errorMessage}SERVER_PACKAGE_NAME`;

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
