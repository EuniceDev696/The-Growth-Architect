import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";

const groupMessages = (messages, filter) => {
  const include = (msg) => {
    if (filter === "new") return msg.status === "New" && msg.sender !== "admin";
    if (filter === "read") return msg.status !== "New" || msg.sender === "admin";
    return true;
  };

  return messages.reduce((acc, msg) => {
    if (!include(msg)) return acc;
    const email = msg.clientEmail || msg.email || "unknown-visitor";
    if (!acc[email]) acc[email] = [];
    acc[email].push(msg);
    return acc;
  }, {});
};

export default function Messages() {
  const [allMessages, setAllMessages] = useState([]);
  const [filter, setFilter] = useState("all");
  const groupedMessages = useMemo(() => groupMessages(allMessages, filter), [allMessages, filter]);

  useEffect(() => {
    apiRequest("/messages")
      .then((data) => setAllMessages(Array.isArray(data) ? data : []))
      .catch(() => setAllMessages([]));
  }, []);

  const markAsRead = async (msgId) => {
    await apiRequest(`/messages/${msgId}/read`, { method: "PATCH" });
    setAllMessages((prev) => prev.map((m) => (String(m.id) === String(msgId) ? { ...m, status: "Read" } : m)));
  };

  const deleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    await apiRequest(`/messages/${msgId}`, { method: "DELETE" });
    setAllMessages((prev) => prev.filter((m) => String(m.id) !== String(msgId)));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Messages (Visitors & Clients)</h1>

      <div className="flex space-x-4 mb-6">
        {["all", "new", "read"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-5 py-2 rounded-lg ${filter === item ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {Object.keys(groupedMessages).length === 0 ? (
        <p className="text-gray-500 text-center py-10">No messages yet from visitors or clients.</p>
      ) : (
        Object.entries(groupedMessages).map(([email, msgs]) => {
          const unread = msgs.filter((m) => m.status === "New" && m.sender !== "admin").length;
          return (
            <div key={email} className="mb-8 bg-white rounded-xl shadow overflow-hidden">
              <div className="bg-teal-600 text-white p-4 flex justify-between items-center">
                <h2 className="font-semibold">
                  {email}
                  {unread > 0 && <span className="ml-3 bg-red-500 px-3 py-1 rounded-full text-xs">{unread} new</span>}
                </h2>
                <span>
                  {msgs.length} message{msgs.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="p-4">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs uppercase">Message</th>
                      <th className="px-6 py-3 text-left text-xs uppercase">From</th>
                      <th className="px-6 py-3 text-left text-xs uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs uppercase">Date</th>
                      <th className="px-6 py-3 text-right text-xs uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {msgs.map((msg) => (
                      <tr key={msg.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 max-w-md">
                          <div className="text-sm text-gray-900 font-medium">{msg.message || msg.text || "No message content"}</div>
                          {msg.note && <div className="text-xs text-gray-500 mt-1">Note: {msg.note}</div>}
                        </td>
                        <td className="px-6 py-4">
                          {msg.sender === "client" ? "Client" : msg.sender === "visitor" ? "Visitor" : "You (Admin)"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              msg.status === "New" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800"
                            }`}
                          >
                            {msg.status || "Sent"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{msg.dateDisplay || new Date(msg.createdAt || msg.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          {msg.status === "New" && msg.sender !== "admin" && (
                            <button onClick={() => markAsRead(msg.id)} className="text-indigo-600 mr-3 hover:underline">
                              Mark Read
                            </button>
                          )}
                          <button onClick={() => deleteMessage(msg.id)} className="text-red-600 hover:underline">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
