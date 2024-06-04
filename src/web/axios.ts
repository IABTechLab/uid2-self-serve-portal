import axios from 'axios';

let requestInterceptor: number;

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL ?? '/api';

export const setAuthToken = (token?: string) => {
  localStorage.setItem('authToken', token ?? '');
  axios.interceptors.request.eject(requestInterceptor);
  requestInterceptor = axios.interceptors.request.use((config) => {
    // Attach current access token ref value to outgoing request headers
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = token ? `Bearer ${token}` : undefined;
    return config;
  });
};

const token = localStorage.getItem('authToken');
setAuthToken(token ?? undefined);
