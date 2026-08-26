import { useEffect, useState } from "react";
import api from "../api/client";

const STATUS_COLORS = {
  new: "bg-somy-accent/10 text-somy-accent-light",
  contacted: "bg-somy-gold/10 text-somy-gold",
  converted: "bg-somy-mint/10 text-somy-mint",
  dismissed: "bg-white/5 text-gray-400",
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadLeads = async () => {
    try {
      const { data } = await api.get("/leads");
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/leads/${id}`, { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-somy-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Leads</h1>
        <p className="text-gray-400 text-sm mt-1">Contact form submissions from the public site</p>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "new", "contacted", "converted", "dismissed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === f ? "bg-somy-accent text-white" : "bg-somy-surface text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && (
              <span className="ml-1 text-[10px] opacity-60">
                ({leads.filter((l) => l.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-12">No leads found.</p>
        ) : (
          filtered.map((lead) => (
            <div key={lead.id} className="bg-somy-surface rounded-xl p-5 border border-white/5 hover:border-white/10 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{lead.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{lead.email}</p>
                  <p className="text-sm text-gray-300">{lead.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(lead.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                  className="bg-somy-navy border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-somy-accent"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
