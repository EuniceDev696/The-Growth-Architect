import { clearClientSession } from "./clientSession";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiRequest(path, options = {}) {
  const preferredAuth = options.auth || "auto";
  const mergedOptions = { ...options };
  delete mergedOptions.auth;

  const headers = {
    "Content-Type": "application/json",
    ...(mergedOptions.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers,
    ...mergedOptions,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isAdminArea = currentPath.startsWith("/admin");
        const isAdminLogin = currentPath === "/admin/login";
        if (isAdminArea && !isAdminLogin) {
          window.location.replace("/admin/login");
        }
      }
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/client")) {
        clearClientSession();
      }
    }
    if (response.status === 403 && preferredAuth === "admin" && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isAdminArea = currentPath.startsWith("/admin");
      const isAdminLogin = currentPath === "/admin/login";
      if (isAdminArea && !isAdminLogin) {
        window.location.replace("/admin/login");
      }
    }
    const message = data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}
