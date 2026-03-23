import { apiRequest } from "../lib/api";
import { getClientUser } from "../lib/clientSession";

export const logActivity = async (text, type = "general") => {
  const user = getClientUser() || { email: "" };
  if (!user.email || !String(text || "").trim()) return;

  try {
    await apiRequest("/client/activity", {
      method: "POST",
      auth: "client",
      body: JSON.stringify({ text: String(text).trim(), type }),
    });
  } catch {
    // Best-effort only.
  }
};
