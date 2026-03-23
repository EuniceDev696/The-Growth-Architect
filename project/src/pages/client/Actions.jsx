import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { apiRequest } from "../../lib/api";

const priorityOrder = { high: 3, medium: 2, low: 1 };

const sortActions = (list) =>
  [...list].sort((a, b) => {
    const priA = priorityOrder[a.priority] || 2;
    const priB = priorityOrder[b.priority] || 2;
    if (priA !== priB) return priB - priA;
    return new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31");
  });

const Actions = () => {
  const [actions, setActions] = useState([]);
  const [newAction, setNewAction] = useState({ text: "", dueDate: "", priority: "medium" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/client/actions", { auth: "client" })
      .then((data) => setActions(sortActions(Array.isArray(data) ? data : [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addAction = async () => {
    if (!newAction.text.trim()) return;
    const created = await apiRequest("/client/actions", {
      method: "POST",
      auth: "client",
      body: JSON.stringify({
        text: newAction.text.trim(),
        dueDate: newAction.dueDate || null,
        priority: newAction.priority,
        status: "pending",
      }),
    });
    setActions((prev) => sortActions([...prev, created]));
    setNewAction({ text: "", dueDate: "", priority: "medium" });
  };

  const toggleDone = async (action) => {
    const updated = await apiRequest(`/client/actions/${action.id}`, {
      method: "PATCH",
      auth: "client",
      body: JSON.stringify({ status: action.status === "pending" ? "completed" : "pending" }),
    });
    setActions((prev) => sortActions(prev.map((item) => (item.id === action.id ? updated : item))));
  };

  const deleteAction = async (actionId) => {
    if (!window.confirm("Delete this action?")) return;
    await apiRequest(`/client/actions/${actionId}`, { method: "DELETE", auth: "client" });
    setActions((prev) => prev.filter((item) => item.id !== actionId));
  };

  const getPriorityBadge = (priority) => {
    const safePriority = priority ? String(priority).toLowerCase() : "medium";
    const styles = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-amber-100 text-amber-800 border-amber-200",
      low: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          styles[safePriority] || "bg-gray-100 text-gray-800"
        }`}
      >
        {safePriority.charAt(0).toUpperCase() + safePriority.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 lg:p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Next Steps & Action Items</h1>
        <p className="mt-2 text-lg text-gray-600">Keep track of what needs to get done - updates appear on your dashboard</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PlusIcon className="h-6 w-6 text-teal-600" /> Add New Action
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            value={newAction.text}
            onChange={(e) => setNewAction({ ...newAction, text: e.target.value })}
            placeholder="e.g. Review Q2 financials with coach"
            className="col-span-1 md:col-span-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="date"
            value={newAction.dueDate}
            onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
            className="px-4 py-3 border rounded-xl"
          />
          <select
            value={newAction.priority}
            onChange={(e) => setNewAction({ ...newAction, priority: e.target.value })}
            className="px-4 py-3 border rounded-xl bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button onClick={addAction} className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition">
          Add Action
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading actions...</div>
      ) : actions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No pending actions - add one above to keep momentum!</div>
      ) : (
        <div className="space-y-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                action.status === "completed" ? "opacity-60 bg-gray-50" : ""
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => toggleDone(action)}
                  className={`p-2 rounded-full mt-1 ${action.status === "completed" ? "bg-green-100" : "bg-gray-100"}`}
                >
                  <CheckCircleIcon className={`h-6 w-6 ${action.status === "completed" ? "text-green-600" : "text-gray-400"}`} />
                </button>
                <div>
                  <p className={`font-medium ${action.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}>{action.text}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    {action.dueDate && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Due: {new Date(action.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    {getPriorityBadge(action.priority)}
                    {action.priority === "high" && action.status !== "completed" && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteAction(action.id)} className="text-red-500 hover:text-red-700 self-start sm:self-center">
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>
          ))}
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

export default Actions;
