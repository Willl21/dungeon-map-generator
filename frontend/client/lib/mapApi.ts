import { API_BASE_URL } from "./apiConfig";

const BASE_URL = API_BASE_URL;

// =====================
// TYPES
// =====================
export interface MapRequest {
  map_type: string;
  environment: string;
  seed?: number;
  image_preset?: string | null;
  beautify?: boolean;
}

export interface MapResponse {
  id: number;          // ← ID map di DB (baru)
  seed: number;
  map_type: string;
  environment: string;
  width: number;
  height: number;
  tiles: string[][];
  objects: any[];
  image_url?: string;
}

export interface MapMeta {
  id: number;
  map_type: string;
  environment: string;
  seed: number;
  image_preset: string | null;
  beautify: boolean;
  image_url: string;
  created_at: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export async function fetchMe(): Promise<UserInfo> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("NOT_LOGGED_IN");

  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}

// =====================
// AUTH HEADER
// =====================
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");

  if (!token) {
    return { "Content-Type": "application/json" };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getBearerHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// =====================
// GENERATE MAP
// =====================
export async function generateMap(data: MapRequest): Promise<MapResponse> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("NOT_LOGGED_IN");
  }

  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR:", text);
    throw new Error("API_ERROR");
  }

  return res.json();
}

// =====================
// FETCH MY MAPS
// =====================
export async function fetchMyMaps(): Promise<MapMeta[]> {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("NOT_LOGGED_IN");

  const res = await fetch(`${BASE_URL}/my-maps`, {
    method: "GET",
    headers: getBearerHeader(),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) throw new Error("FETCH_MAPS_FAILED");

  return res.json();
}

// =====================
// GET MAP DETAIL
// =====================
export async function getMapDetail(id: number): Promise<MapMeta> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("NOT_LOGGED_IN");

  const res = await fetch(`${BASE_URL}/maps/${id}`, {
    method: "GET",
    headers: getBearerHeader(),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("UNAUTHORIZED");
  }

  if (res.status === 403) throw new Error("FORBIDDEN");
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("FETCH_MAP_FAILED");

  return res.json();
}

// =====================
// DELETE MAP
// =====================
export async function deleteMap(id: number): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("NOT_LOGGED_IN");

  const res = await fetch(`${BASE_URL}/maps/${id}`, {
    method: "DELETE",
    headers: getBearerHeader(),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("UNAUTHORIZED");
  }

  if (res.status === 403) throw new Error("FORBIDDEN");
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("DELETE_FAILED");
}

// =====================
// DOWNLOAD MAP BY ID
// =====================
export async function downloadMap(id: number): Promise<Blob> {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("NOT_LOGGED_IN");

  const res = await fetch(`${BASE_URL}/download/${id}`, {
    method: "GET",
    headers: getBearerHeader(),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("UNAUTHORIZED");
  }

  if (res.status === 403) throw new Error("FORBIDDEN");
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("DOWNLOAD_FAILED");

  return res.blob();
}