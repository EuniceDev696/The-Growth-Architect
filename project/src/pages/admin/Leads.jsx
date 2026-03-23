import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";

const STAGES = ["new", "qualified", "proposal", "won", "lost"];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    apiRequest("/leads")
      .then((data) => {
        if (mounted) setLeads(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (mounted) setStatusMessage(error.message || "Unable to load leads.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s, []]));
    leads.forEach((lead) => {
      const stage = STAGES.includes(lead.stage) ? lead.stage : "new";
      map[stage].push(lead);
    });
    return map;
  }, [leads]);

  const moveLead = async (leadId, stage) => {
    try {
      const updated = await apiRequest(`/leads/${leadId}`, {
        method: "PATCH",
        body: JSON.stringify({ stage }),
      });
      setLeads((prev) => prev.map((lead) => (lead.id === leadId ? updated : lead)));
    } catch (error) {
      setStatusMessage(error.message || "Unable to update lead stage.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">CRM Pipeline</h1>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {STAGES.map((stage) => (
          <section key={stage} className="bg-white rounded-xl border border-slate-200 p-4 min-h-[280px]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 mb-3">
              {stage} ({grouped[stage].length})
            </h2>
            <div className="space-y-3">
              {grouped[stage].map((lead) => (
                <article key={lead.id} className="border rounded-lg p-3">
                  <p className="font-medium text-slate-900">{lead.name || lead.email}</p>
                  <p className="text-xs text-slate-600">{lead.email}</p>
                  <p className="text-xs text-slate-500 mt-1">Source: {lead.source || "website"}</p>
                  <select
                    value={lead.stage || "new"}
                    onChange={(e) => moveLead(lead.id, e.target.value)}
                    className="mt-2 w-full border rounded px-2 py-1 text-xs"
                  >
                    {STAGES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      {statusMessage && <p className="mt-4 text-sm text-indigo-700">{statusMessage}</p>}
    </div>
  );
}
