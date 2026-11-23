/**
 * publicClient — unauthenticated axios instance for public API calls.
 *
 * The backend exposes:
 *   GET /api/v1/publications   (is_public=true, is_published=true)
 *   GET /api/v1/events         (is_public=true)
 *   GET /api/v1/cms/pages      (status=published)
 *   GET /api/v1/organisation
 *
 * All are open (no auth required) when querying public records.
 */
import axios from "axios";
import { API_BASE } from "@/app/config/api.config";

export const publicClient = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});
