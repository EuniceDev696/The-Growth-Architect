import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";

const DEFAULT_SETTINGS = {
  businessName: "The Growth Architect",
  adminEmail: "admin@test.com",
  supportEmail: "support@growtharchitect.com",
  timezone: "America/New_York",
  notifications: {
    email: true,
    bookings: true,
    messages: true,
    reminders: false,
  },
  branding: {
    primaryColor: "#4f46e5",
    accentColor: "#14b8a6",
  },
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiRequest("/settings")
      .then((remoteSettings) => {
        if (!isMounted) return;
        const merged = {
          ...DEFAULT_SETTINGS,
          ...remoteSettings,
          notifications: {
            ...DEFAULT_SETTINGS.notifications,
            ...(remoteSettings.notifications || {}),
          },
          branding: {
            ...DEFAULT_SETTINGS.branding,
            ...(remoteSettings.branding || {}),
          },
        };
        setSettings(merged);
      })
      .catch((err) => {
        setStatusMessage(err.message || "Unable to load settings from server.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = useMemo(
    () => [
      { id: "general", label: "General" },
      { id: "notifications", label: "Notifications" },
      { id: "branding", label: "Branding" },
      { id: "security", label: "Security" },
    ],
    []
  );

  const saveSettings = async () => {
    try {
      const saved = await apiRequest("/settings", {
        method: "POST",
        body: JSON.stringify(settings),
      });
      setSettings({
        ...settings,
        ...saved,
        notifications: {
          ...settings.notifications,
          ...(saved.notifications || {}),
        },
        branding: {
          ...settings.branding,
          ...(saved.branding || {}),
        },
      });
      setStatusMessage("Settings saved successfully.");
    } catch (err) {
      setStatusMessage(err.message || "Failed to save settings.");
    }
  };

  const resetDefaults = async () => {
    if (!window.confirm("Reset all settings to defaults?")) return;

    setSettings(DEFAULT_SETTINGS);

    try {
      await apiRequest("/settings", {
        method: "POST",
        body: JSON.stringify(DEFAULT_SETTINGS),
      });
      setStatusMessage("Settings reset to defaults.");
    } catch (err) {
      setStatusMessage(err.message || "Failed to reset settings on server.");
    }
  };

  const updatePassword = async () => {
    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      setStatusMessage("Fill all password fields.");
      return;
    }
    if (securityForm.newPassword.length < 6) {
      setStatusMessage("New password must be at least 6 characters.");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setStatusMessage("New password and confirm password do not match.");
      return;
    }

    try {
      await apiRequest("/admin/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        }),
      });
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setStatusMessage("Admin password updated.");
    } catch (err) {
      setStatusMessage(err.message || "Failed to update password.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <div className="flex space-x-4 border-b mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 font-medium whitespace-nowrap ${
              activeTab === tab.id ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Admin Login Email</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value.trim() })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value.trim() })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="America/New_York">Eastern Time (UTC-5)</option>
              <option value="America/Chicago">Central Time (UTC-6)</option>
              <option value="America/Denver">Mountain Time (UTC-7)</option>
              <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          {[
            { key: "email", label: "Email Notifications", description: "Receive general account updates" },
            { key: "bookings", label: "Booking Alerts", description: "Notify when new bookings arrive" },
            { key: "messages", label: "Message Alerts", description: "Notify on new client/visitor messages" },
            { key: "reminders", label: "Daily Summary", description: "Send end-of-day admin summary" },
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center border-b pb-4 last:border-b-0">
              <div>
                <label className="font-medium">{item.label}</label>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [item.key]: !settings.notifications[item.key],
                    },
                  })
                }
                className={`w-12 h-6 rounded-full relative ${
                  settings.notifications[item.key] ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notifications[item.key] ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "branding" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primary Color</label>
            <input
              type="color"
              value={settings.branding.primaryColor}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  branding: { ...settings.branding, primaryColor: e.target.value },
                })
              }
              className="w-20 h-10 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Accent Color</label>
            <input
              type="color"
              value={settings.branding.accentColor}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  branding: { ...settings.branding, accentColor: e.target.value },
                })
              }
              className="w-20 h-10 border rounded-lg"
            />
          </div>

          <p className="text-sm text-gray-600">
            Colors are saved for admin configuration and can be wired into theme styling later.
          </p>
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <p className="text-sm text-gray-600">Update admin login password securely.</p>

          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={securityForm.currentPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={securityForm.newPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={securityForm.confirmPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={updatePassword}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg"
          >
            Update Password
          </button>
        </div>
      )}

      {statusMessage && <p className="mt-4 text-sm text-indigo-700">{statusMessage}</p>}

      <div className="mt-6 flex gap-3">
        <button
          onClick={saveSettings}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          Save Settings
        </button>
        <button
          onClick={resetDefaults}
          className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg"
        >
          Reset Defaults
        </button>
      </div>
    </div>
  );
}
