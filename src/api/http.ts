import { API_BASE_URL } from "@/constants/constants";
import { getItem } from "@/utils/persistence";
import axios from "axios";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

http.interceptors.request.use(
  (config) => {
    const accessToken = getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
