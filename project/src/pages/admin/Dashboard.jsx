import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { COACHES } from "../../data/coaches";

const formatNaira = (value) => `₦${Number(value || 0).toLocaleString("en-NG")}`;

export default function Dashboard() {
  const [apiOverview, setApiOverview] = useState({
    clients: 0,
    revenue: 0,
    meetings: 0,
    programs: 0,
    unreadMessages: 0,
    bookings: 0,
    recentActivity: [],
  });

  useEffect(() => {
    let isMounted = true;
    apiRequest("/dashboard/overview")
      .then((data) => {
        if (isMounted) setApiOverview((prev) => ({ ...prev, ...(data || {}) }));
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      clients: apiOverview.clients || 0,
      revenue: apiOverview.revenue || 0,
      meetings: apiOverview.meetings || 0,
      programs: apiOverview.programs || 0,
      unreadMessages: apiOverview.unreadMessages || 0,
      bookings: apiOverview.bookings || 0,
    }),
    [apiOverview]
  );

  const recentActivity = useMemo(() => apiOverview.recentActivity || [], [apiOverview]);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Total Clients</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.clients}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Estimated Revenue</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{formatNaira(stats.revenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Upcoming Meetings</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.meetings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Active Programs</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.programs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{item.text}</p>
                  <p className="text-sm text-gray-600">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/clients" className="block w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
              Manage Clients ({stats.clients})
            </Link>
            <Link to="/admin/bookings" className="block w-full p-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg">
              Review Bookings ({stats.bookings})
            </Link>
            <Link to="/admin/messages" className="block w-full p-3 border border-gray-300 hover:bg-gray-50 rounded-lg">
              Open Messages ({stats.unreadMessages} new)
            </Link>
            <Link to="/admin/programs" className="block w-full p-3 border border-gray-300 hover:bg-gray-50 rounded-lg">
              Update Programs
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Coaching Team</h2>
          <div className="space-y-3">
            {COACHES.map((coach) => (
              <div key={coach.id} className="p-3 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900">{coach.name}</p>
                <p className="text-sm text-gray-600">{coach.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
