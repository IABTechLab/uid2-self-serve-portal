const errorMessage = 'Unable to get envar value';

export const SSP_KK_AUDIENCE = process.env.SSP_KK_AUDENCE ?? errorMessage;
export const SSP_KK_ISSUER_BASE_URL = process.env.SSP_KK_ISSUER_BASE_URL ?? errorMessage;
export const SSP_KK_REALM = process.env.SSP_KK_REALM ?? errorMessage;
export const SSP_KK_AUTH_SERVER_URL = process.env.SSP_KK_AUTH_SERVER_URL ?? errorMessage;
export const SSP_KK_SSL_REQUIRED = process.env.SSP_KK_SSL_REQUIRED ?? errorMessage;
export const SSP_KK_SSL_RESOURCE = process.env.SSP_KK_SSL_RESOURCE ?? errorMessage;
export const SSP_KK_SSL_PUBLIC_CLIENT = process.env.SSP_KK_SSL_PUBLIC_CLIENT ?? errorMessage;
export const SSP_KK_SSL_CONFIDENTIAL_PORT = process.env.SSP_KK_SSL_CONFIDENTIAL_PORT ?? errorMessage;
