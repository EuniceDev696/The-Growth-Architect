import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { apiRequest } from "../../lib/api";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: "", status: "in-progress" });
  const [newMilestone, setNewMilestone] = useState("");
  const [loading, setLoading] = useState(true);

  const loadGoals = async () => {
    const data = await apiRequest("/client/goals", { auth: "client" });
    setGoals(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadGoals()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addGoal = async () => {
    if (!newGoal.title.trim()) return;
    const created = await apiRequest("/client/goals", {
      method: "POST",
      auth: "client",
      body: JSON.stringify({ title: newGoal.title.trim(), status: newGoal.status }),
    });
    setGoals((prev) => [...prev, created]);
    setNewGoal({ title: "", status: "in-progress" });
  };

  const updateGoal = async (goalId, updates) => {
    const updated = await apiRequest(`/client/goals/${goalId}`, {
      method: "PATCH",
      auth: "client",
      body: JSON.stringify(updates),
    });
    setGoals((prev) => prev.map((goal) => (goal.id === goalId ? updated : goal)));
  };

  const addMilestone = async (goal) => {
    if (!newMilestone.trim()) return;
    const nextMilestones = [
      ...(goal.milestones || []),
      { id: `ms-${Date.now()}`, text: newMilestone.trim(), completed: false },
    ];
    await updateGoal(goal.id, { milestones: nextMilestones });
    setNewMilestone("");
  };

  const toggleMilestone = async (goal, milestoneId) => {
    const nextMilestones = (goal.milestones || []).map((milestone) =>
      milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone
    );
    await updateGoal(goal.id, { milestones: nextMilestones });
  };

  const deleteGoal = async (goalId) => {
    if (!window.confirm("Delete this goal?")) return;
    await apiRequest(`/client/goals/${goalId}`, { method: "DELETE", auth: "client" });
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 lg:p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Your Goals & Progress</h1>
        <p className="mt-2 text-lg text-gray-600">Track what matters - updates show instantly on dashboard</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PlusIcon className="h-6 w-6 text-teal-600" /> Add New Goal
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="e.g. Increase revenue by 30% this quarter"
            className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button onClick={addGoal} className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition">
            Add Goal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No goals yet - add one above to start tracking progress.</div>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{goal.title}</h3>
                <button onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-700">
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Milestones</h4>
                <ul className="space-y-3">
                  {(goal.milestones || []).map((milestone) => (
                    <li key={milestone.id} className="flex items-center gap-3">
                      <button
                        onClick={() => toggleMilestone(goal, milestone.id)}
                        className={`p-1 rounded-full ${milestone.completed ? "bg-green-100" : "bg-gray-100"}`}
                      >
                        <CheckCircleIcon className={`h-5 w-5 ${milestone.completed ? "text-green-600" : "text-gray-400"}`} />
                      </button>
                      <span className={milestone.completed ? "line-through text-gray-500" : ""}>{milestone.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    placeholder="Add new milestone..."
                    className="flex-1 px-4 py-2 border rounded-xl"
                  />
                  <button onClick={() => addMilestone(goal)} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200">
                    Add
                  </button>
                </div>
              </div>
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

export default Goals;
