import { getItem } from "@/utils/persistence";
import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 5000,
});

http.interceptors.request.use(
  (config) => {
    const accessToken = getItem("access_token");
    console.log(accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
