import axios from 'axios';

let requestInterceptor: number;

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

export const ejectHeader = () => {
  axios.interceptors.request.eject(requestInterceptor);
};

export const setAuthToken = (token?: string) => {
  ejectHeader();
  requestInterceptor = axios.interceptors.request.use((config) => {
    // Attach current access token ref value to outgoing request headers
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = token ? `Bearer ${token}` : undefined;
    return config;
  });
};
