import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [remoteClients, setRemoteClients] = useState([]);

  useEffect(() => {
    let isMounted = true;
    apiRequest("/clients")
      .then((data) => {
        if (isMounted) setRemoteClients(Array.isArray(data) ? data : []);
      })
      .catch(() => setRemoteClients([]));
    return () => {
      isMounted = false;
    };
  }, []);

  const clients = useMemo(() => remoteClients, [remoteClients]);

  const filteredClients = clients.filter((client) => {
    const q = search.toLowerCase();
    return client.name.toLowerCase().includes(q) || client.email.toLowerCase().includes(q);
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Client Management</h1>
      <p className="text-sm text-gray-500 mb-6">
        {clients.length} total clients from registrations, bookings, sessions, and messages.
      </p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Client</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Bookings</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Sessions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Messages</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Last Activity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4">
                  <div className="font-medium">{client.name || "Client"}</div>
                </td>
                <td className="px-6 py-4">
                  <div>{client.email}</div>
                </td>
                <td className="px-6 py-4">{client.bookings}</td>
                <td className="px-6 py-4">{client.sessions}</td>
                <td className="px-6 py-4">{client.messages}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      client.hasUpcoming
                        ? "bg-green-100 text-green-800"
                        : client.bookings + client.sessions + client.messages > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {client.hasUpcoming
                      ? "Active"
                      : client.bookings + client.sessions + client.messages > 0
                        ? "Warm"
                        : "New"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {client.lastActivityAt ? new Date(client.lastActivityAt).toLocaleString() : "No activity"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
