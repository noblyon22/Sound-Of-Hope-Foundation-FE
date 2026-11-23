import axios from "axios";
import { API_CONFIG } from "@/app/config/api.config";

/** Shared Axios defaults — do NOT attach auth headers here. */
export const baseAxios = axios.create({
  baseURL: `${API_CONFIG.baseURL}/api/${API_CONFIG.version}`,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
