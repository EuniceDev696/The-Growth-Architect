import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";

const formatNaira = (value) => `₦${Number(value || 0).toLocaleString("en-NG")}`;

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [newProgram, setNewProgram] = useState({ name: "", type: "", price: "" });

  useEffect(() => {
    let isMounted = true;
    apiRequest("/programs")
      .then((data) => {
        if (isMounted) setPrograms(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isMounted) setPrograms([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddProgram = async () => {
    const name = newProgram.name.trim();
    const type = newProgram.type.trim();
    const price = Number(newProgram.price);
    if (!name || !type || Number.isNaN(price) || price < 0) {
      alert("Enter a valid program name, type, and price.");
      return;
    }

    const created = await apiRequest("/programs", {
      method: "POST",
      body: JSON.stringify({ name, type, price }),
    });
    setPrograms((prev) => [...prev, created]);
    setNewProgram({ name: "", type: "", price: "" });
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm("Delete this program?")) return;
    await apiRequest(`/programs/${programId}`, { method: "DELETE" });
    setPrograms((prev) => prev.filter((p) => p.id !== programId));
  };

  const programStats = useMemo(() => {
    const avgPrice = programs.length
      ? Math.round(programs.reduce((sum, p) => sum + Number(p.price || 0), 0) / programs.length)
      : 0;

    return {
      list: programs,
      totalClients: 0,
      avgPrice,
    };
  }, [programs]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Programs & Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Total Programs</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{programStats.list.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Client Enrollments</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{programStats.totalClients}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">Avg. Program Price</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{formatNaira(programStats.avgPrice)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Your Programs</h2>
        </div>
        <div className="divide-y">
          {programStats.list.map((program) => (
            <div key={program.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{program.name}</h3>
                  <p className="text-sm text-gray-600">{program.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatNaira(program.price)}</p>
                  <button onClick={() => handleDeleteProgram(program.id)} className="text-sm text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Add New Program</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Program Name"
            value={newProgram.name}
            onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={newProgram.type}
            onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Select Type</option>
            <option value="Coaching">Coaching</option>
            <option value="Consulting">Consulting</option>
            <option value="Workshop">Workshop</option>
          </select>
          <input
            type="number"
            min="0"
            placeholder="Price"
            value={newProgram.price}
            onChange={(e) => setNewProgram({ ...newProgram, price: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
        </div>
        <button onClick={handleAddProgram} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
          Create Program
        </button>
      </div>
    </div>
  );
}
