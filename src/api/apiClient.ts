import axios, { type AxiosInstance } from "axios";
import { config } from "@/config";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in your .env file");
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: config.timeout,
  params: {
    appid: API_KEY,
  },
});
