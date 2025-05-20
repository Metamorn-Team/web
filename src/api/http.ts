import { APP_VERSION } from "@/constants/constants";
import { getItem, persistItem, removeItem } from "@/utils/persistence";
import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});

http.interceptors.request.use(
  (config) => {
    const accessToken = getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers["App-Version"] = APP_VERSION;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(null, async (error) => {
  const originalRequest = error.config;

  if (
    error.response &&
    error.response.status === 401 &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data.accessToken;
      if (!newAccessToken) return;

      persistItem("access_token", newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return http(originalRequest);
    } catch (refreshError) {
      removeItem("access_token");
      removeItem("profile");

      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
});
