import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { clearClientSession, getClientUser, setClientSession } from "../../lib/clientSession";

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = getClientUser() || {
    name: "",
    email: "",
  };

  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
  });
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    try {
      const response = await apiRequest("/client/profile", {
        method: "POST",
        auth: "client",
        body: JSON.stringify(form),
      });
      if (response?.user) {
        setClientSession({ user: response.user });
      }
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error.message || "Could not update profile.");
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/client/logout", { method: "POST", auth: "client" });
    } catch {
      // no-op
    } finally {
      clearClientSession();
      navigate("/client/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account details.</p>
      </header>

      <section className="bg-white rounded-2xl border p-6 shadow-sm max-w-2xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-xl px-4 py-3 mb-5"
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-xl px-4 py-3 mb-5"
        />

        <button onClick={handleSave} className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700">
          Save Changes
        </button>
        <button onClick={handleLogout} className="ml-3 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800">
          Log Out
        </button>
        {message && <p className="text-sm text-teal-700 mt-3">{message}</p>}
      </section>

      <div className="mt-8">
        <Link to="/client/dashboard" className="text-teal-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
