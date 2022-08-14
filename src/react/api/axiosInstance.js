import axios from 'axios';

const handleRequestConfig = (config) => {
  if (process.env.NODE_ENV === 'development') {
    const { url, data, params } = config;
    if (data && Object.keys(data).length) {
      console.group(`request ${url}`);
      console.table(JSON.parse(JSON.stringify(data)));
      console.groupEnd();
    } else if (params && Object.keys(params).length) {
      console.group(`request ${url}`);
      console.table(JSON.parse(JSON.stringify(params)));
      console.groupEnd();
    } else console.log(`request ${url}`);
  }
  return config;
};

const handleResponseError = (error) => {
  if (process.env.NODE_ENV === 'development') {
    const { response, request, message } = error;
    if (response) {
      const { status, statusText, data } = response;
      console.error(`(${status}) ${statusText}`);
      console.error(data);
    } else if (request) console.error(request);
    else console.error(message);
  }
  return Promise.reject(error);
};

const handleResponseResult = ({ config, data }) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`response ${config.url}`);
    console.log(data);
    console.groupEnd();
  }
  return data;
};

export const createAxiosInstance = (config) => {
  const instance = axios.create(config);
  instance.interceptors.request.use(handleRequestConfig);
  instance.interceptors.response.use(handleResponseResult, handleResponseError);
  return instance;
};
