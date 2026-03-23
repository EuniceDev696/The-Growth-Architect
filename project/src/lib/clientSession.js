const CLIENT_USER_KEY = "user";

export function getClientUser() {
  try {
    return JSON.parse(sessionStorage.getItem(CLIENT_USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function setClientSession({ user }) {
  if (user) {
    sessionStorage.setItem(CLIENT_USER_KEY, JSON.stringify(user));
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("userUpdated"));
  }
}

export function clearClientSession() {
  sessionStorage.removeItem(CLIENT_USER_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("userUpdated"));
  }
}
