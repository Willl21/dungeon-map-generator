/**
 * Single source of truth for the backend base URL.
 *
 * Local dev: falls back to the FastAPI dev server on 127.0.0.1:8000.
 * Production: set `VITE_API_URL` (e.g. https://your-backend.up.railway.app)
 * as a build-time env var on the host — Vite inlines `VITE_*` vars at build.
 * Trailing slash is trimmed so callers can safely do `${API_BASE_URL}/path`.
 */
export const API_BASE_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");
