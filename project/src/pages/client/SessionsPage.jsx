import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDaysIcon, ClockIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { apiRequest } from "../../lib/api";

const toTimeValue = (time) => {
  const raw = String(time || "").trim();
  if (!raw) return "";
  const ampm = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let h = Number(ampm[1]);
    const m = Number(ampm[2]);
    const mer = ampm[3].toUpperCase();
    if (mer === "PM" && h !== 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  return raw;
};

const isPastByDate = (record) => {
  const dt = new Date(`${record.date || ""}T${toTimeValue(record.time || record.timeSlot) || "23:59"}`);
  if (Number.isNaN(dt.getTime())) return false;
  return dt < new Date();
};

const Sessions = () => {
  const [filter, setFilter] = useState("upcoming");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    const data = await apiRequest("/client/sessions", { auth: "client" });
    setSessions(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadSessions()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const clearPreviousMeetings = async () => {
    if (!window.confirm("Clear previous meetings from your list?")) return;
    await apiRequest("/client/sessions/clear-past", { method: "POST", auth: "client" });
    await loadSessions();
    setFilter("upcoming");
  };

  const getTimeRemaining = (dateStr, timeStr) => {
    const tv = toTimeValue(timeStr);
    if (!dateStr || !tv) return "";
    const sessionTime = new Date(`${dateStr}T${tv}:00`);
    const now = new Date();
    const diffMs = sessionTime - now;
    if (diffMs < 0) return "Already started";
    const days = Math.floor(diffMs / 86400000);
    const hours = Math.floor((diffMs % 86400000) / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    if (days > 0) return `In ${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `In ${hours} hour${hours > 1 ? "s" : ""}`;
    if (mins > 0) return `In ${mins} min`;
    return "Soon";
  };

  const filteredSessions = sessions.filter((s) => {
    const status = String(s.status || "").toLowerCase();
    const isPast = status === "completed" || status === "cancelled" || isPastByDate(s);
    if (filter === "upcoming") return !isPast;
    if (filter === "past") return isPast;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sessions & Meetings</h1>
        <p className="mt-2 text-lg text-gray-600">All your coaching sessions - upcoming and past</p>
      </header>

      <div className="mb-6 flex gap-3 flex-wrap">
        {["upcoming", "past", "all"].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              filter === key ? "bg-teal-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
        <button onClick={clearPreviousMeetings} className="px-5 py-2 rounded-xl text-sm font-medium bg-white border border-red-300 text-red-700 hover:bg-red-50">
          Clear Previous Meetings
        </button>
        <Link to="/client/meeting" className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">
          Join by Session ID
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">Loading sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <CalendarDaysIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-6 text-xl font-medium text-gray-900">No sessions in this view</h3>
          <Link to="/client/book-session" className="inline-flex mt-6 items-center px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700">
            Book a Session
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSessions.map((session) => {
            const status = String(session.status || "").toLowerCase();
            const past = status === "completed" || status === "cancelled" || isPastByDate(session);
            return (
              <div key={session.id} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{session.type || session.service || "Session"}</h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 mr-1.5" />
                        {session.date}
                      </div>
                      {(session.time || session.timeSlot) && (
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 mr-1.5" />
                          {session.time || session.timeSlot}
                        </div>
                      )}
                      {!past && <div className="text-blue-700 font-medium">{getTimeRemaining(session.date, session.time || session.timeSlot)}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {!past && session.id && (
                      <Link
                        to={`/client/meeting/${session.id}?t=${encodeURIComponent(session.meetingToken || "")}`}
                        className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-medium"
                      >
                        <VideoCameraIcon className="h-5 w-5 mr-2" />
                        Join Now
                      </Link>
                    )}
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-medium ${
                        !past ? "bg-blue-100 text-blue-800" : status === "cancelled" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {!past ? "Upcoming" : status === "cancelled" ? "Cancelled" : "Completed"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <Link to="/client/dashboard" className="text-teal-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Sessions;
