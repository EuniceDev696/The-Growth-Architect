// src/pages/client/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { clearClientSession, getClientUser } from "../../lib/clientSession";
import {
  CalendarDaysIcon,
  ClockIcon,
  VideoCameraIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const ClientDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getClientUser();
        if (!user?.email) {
          setError("Please log in to view your dashboard.");
          setLoading(false);
          return;
        }
        const response = await apiRequest("/client/dashboard", { auth: "client" });
        setSessions(Array.isArray(response?.sessions) ? response.sessions : []);
        setGoals(Array.isArray(response?.goals) ? response.goals : []);
        setActions(
          (Array.isArray(response?.actions) ? response.actions : []).filter(
            (item) => String(item.status || "pending").toLowerCase() === "pending"
          )
        );
        setRecentActivity(Array.isArray(response?.recentActivity) ? response.recentActivity : []);

        setLoading(false);
      } catch (err) {
        clearClientSession();
        setError(err.message || "Unable to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchData().catch(() => {
      setError("Unable to load dashboard data. Please try again.");
      setLoading(false);
    });
  }, []);

  const user = getClientUser() || { name: "Valued Client", email: "" };

  const calculateProgress = () => {
    if (goals.length === 0) {
      return {
        overall: 0,
        goalsCompleted: 0,
        totalGoals: 0,
        completedMilestones: 0,
        totalMilestones: 0,
      };
    }

    let totalMilestones = 0;
    let completedMilestones = 0;
    let completedGoals = 0;

    goals.forEach((goal) => {
      if (goal.milestones?.length > 0) {
        totalMilestones += goal.milestones.length;
        const done = goal.milestones.filter((m) => m.completed).length;
        completedMilestones += done;

        if (done === goal.milestones.length || goal.status === "completed") {
          completedGoals++;
        }
      } else if (goal.status === "completed") {
        completedGoals++;
      }
    });

    const overall = totalMilestones > 0
      ? Math.min(100, Math.round((completedMilestones / totalMilestones) * 100))
      : 0;

    return {
      overall,
      goalsCompleted: completedGoals,
      totalGoals: goals.length,
      completedMilestones,
      totalMilestones,
    };
  };

  const progress = calculateProgress();

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      rescheduled: "bg-amber-100 text-amber-800 border-amber-200",
      pending: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
          styles[status?.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Issue</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("/client/auth")}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70">
      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 bg-white border-r border-gray-200 lg:min-h-screen p-6 lg:sticky lg:top-0">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-indigo-800">Your Portal</h2>
            <p className="text-sm text-gray-600 mt-1">The Growth Architect</p>
          </div>
          <nav className="space-y-1">
            {[
              { to: "/client/dashboard", icon: ChartBarIcon, label: "Dashboard" },
              { to: "/client/sessions", icon: CalendarDaysIcon, label: "Sessions & Meetings" },
              { to: "/client/goals", icon: ArrowTrendingUpIcon, label: "Goals & Progress" },
              { to: "/client/actions", icon: ArrowTrendingUpIcon, label: "Next Steps" },
              { to: "/client/resources", icon: DocumentTextIcon, label: "Resources & Library" },
              { to: "/client/messages", icon: ChatBubbleLeftRightIcon, label: "Messages" },
              { to: "/client/profile", icon: UserCircleIcon, label: "Profile & Settings" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition ${
                  item.to === "/client/dashboard" ? "bg-teal-50 text-teal-700 font-medium" : ""
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Your strategic growth journey, overview & next steps
            </p>
          </header>

          {loading ? (
            <div className="grid gap-8 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-2xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Overview */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Journey Progress</h3>
                    <ArrowTrendingUpIcon className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-3 bg-gray-200 rounded-full">
                      <div
                        style={{ width: `${progress.overall}%` }}
                        className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full"
                      ></div>
                    </div>
                    <div className="text-right mt-2 text-sm font-medium text-gray-700">
                      {progress.overall}% Complete
                      {progress.totalMilestones > 0 && (
                        <span> ({progress.completedMilestones}/{progress.totalMilestones} milestones)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Goals Achieved</h3>
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-4xl font-bold text-gray-900">
                    {progress.goalsCompleted}/{progress.totalGoals}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Goals completed</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center text-center">
                  <Link
                    to="/client/book-session"
                    className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition shadow-md"
                  >
                    <CalendarDaysIcon className="h-5 w-5 mr-2" />
                    Book Next Session
                  </Link>
                  <p className="mt-4 text-sm text-gray-500">Keep momentum going</p>
                </div>
              </section>

              {/* Quick Actions + Upcoming Sessions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Sessions Card – updated Join button logic */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Your Sessions</h2>
                    <Link to="/client/sessions" className="text-teal-600 hover:underline text-sm font-medium">
                      View All
                    </Link>
                  </div>

                  {sessions.length === 0 ? (
                    <div className="p-12 text-center">
                      <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions scheduled</h3>
                      <p className="mt-2 text-sm text-gray-500 mb-6">
                        Book your next strategy or executive coaching session to continue building momentum.
                      </p>
                      <Link
                        to="/client/book-session"
                        className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
                      >
                        Schedule Now
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {sessions.slice(0, 3).map((session) => (
                        <div key={session.id || `session-${Date.now()}`} className="p-6 hover:bg-gray-50 transition">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {session.type?.charAt(0).toUpperCase() + session.type?.slice(1) || "Session"}
                                </h3>
                                {getStatusBadge(session.status)}
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <CalendarDaysIcon className="h-5 w-5 mr-1.5" />
                                  {session.date || "Date not set"}
                                </div>
                                {session.time && (
                                  <div className="flex items-center">
                                    <ClockIcon className="h-5 w-5 mr-1.5" />
                                    {session.time}
                                  </div>
                                )}
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                Coach: <span className="font-medium text-gray-800">{session.consultant || "Stella Martins"}</span>
                              </p>
                            </div>

                            {/* Join button – shows for upcoming sessions (relaxed condition) */}
                            {(session.status?.toLowerCase() === "upcoming" || !session.status) && session.id && (
                              <Link
                                to={`/client/meeting/${session.id}?t=${encodeURIComponent(session.meetingToken || "")}`}
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
                              >
                                <VideoCameraIcon className="h-5 w-5 mr-2" />
                                Join Meeting
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Next Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-indigo-600" />
                    Next Steps
                  </h3>

                  {actions.length === 0 ? (
                    <p className="text-gray-600">No pending actions right now — you're on top of everything!</p>
                  ) : (
                    <ul className="space-y-4">
                      {actions.slice(0, 5).map((action) => (
                        <li key={action.id} className="flex items-start gap-3 text-gray-700">
                          <CheckCircleIcon className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span>{action.text}</span>
                            {action.dueDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Due: {new Date(action.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link to="/client/actions" className="text-teal-600 hover:underline text-sm font-medium">
                      View All Action Items →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Activity + Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-5">Recent Activity</h3>

                  {recentActivity.length === 0 ? (
                    <p className="text-gray-600 italic">
                      No activity yet — complete some goals or actions to see updates here!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                          <div className="rounded-full bg-indigo-100 p-2">
                            {log.type === "milestone" && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                            {log.type === "action" && <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-600" />}
                            {log.type === "goal" && <ArrowTrendingUpIcon className="h-5 w-5 text-teal-600" />}
                            {![ "milestone", "action", "goal" ].includes(log.type) && (
                              <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{log.text}</p>
                            <p className="text-sm text-gray-500 mt-1">{log.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Resources */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-5">Your Resources</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link to="/client/resources" className="flex items-center gap-3 text-teal-700 hover:text-teal-900 transition">
                        <DocumentTextIcon className="h-5 w-5" />
                        Leadership Influence Model Worksheet
                      </Link>
                    </li>
                    <li>
                      <Link to="/client/resources" className="flex items-center gap-3 text-teal-700 hover:text-teal-900 transition">
                        <VideoCameraIcon className="h-5 w-5" />
                        Session Recording: Q1 Strategy Review
                      </Link>
                    </li>
                    <li>
                      <Link to="/client/resources" className="flex items-center gap-3 text-teal-700 hover:text-teal-900 transition">
                        <ChartBarIcon className="h-5 w-5" />
                        Growth Metrics Tracker Template
                      </Link>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link to="/client/resources" className="text-indigo-600 hover:underline text-sm font-medium">
                      Explore Full Library →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="mt-16 text-center text-sm text-gray-500">
                Your private portal • Questions? Message your Growth Architect directly or visit{" "}
                <Link to="/client/messages" className="text-teal-600 hover:underline">
                  support
                </Link>.
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
