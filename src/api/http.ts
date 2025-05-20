import { APP_VERSION } from "@/constants/constants";
import { getItem } from "@/utils/persistence";
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
