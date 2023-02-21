import axios from "axios";
import localStorageUtil from "../utils/localStorageUtil";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BE_URL,
  headers: {
    "content-type": "application/json"
  }
});

axiosClient.interceptors.request.use(async (config) => {
  const customHeaders = {};
  // await isTokenExpired();
  const accessToken = localStorageUtil.getItem(localStorageUtil.LOCAL_STORAGE.ACCESS_TOKEN);
  if (accessToken) {
    customHeaders.Authorization = `Bearer ${accessToken}`;
  }

  return {
    ...config,
    headers: {
      ...customHeaders,
      ...config.headers
    }
  };
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // console.error(error);
    if (error && error.response && error.response.data) {
      return error.response.data;
    }
    return error;
  }
);

export default axiosClient;
