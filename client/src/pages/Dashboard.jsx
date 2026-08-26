import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, leads: 0, activeTasks: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, tasksRes, leadsRes] = await Promise.all([
          api.get("/projects"),
          api.get("/tasks"),
          api.get("/leads"),
        ]);
        const tasks = tasksRes.data;
        setStats({
          projects: projectsRes.data.length,
          tasks: tasks.length,
          activeTasks: tasks.filter((t) => t.status === "in_progress").length,
          leads: leadsRes.data.length,
        });
        setRecentLeads(leadsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-somy-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Total Projects", value: stats.projects, color: "bg-somy-accent/10 text-somy-accent-light" },
    { label: "Active Tasks", value: stats.activeTasks, color: "bg-somy-gold/10 text-somy-gold" },
    { label: "Total Tasks", value: stats.tasks, color: "bg-somy-mint/10 text-somy-mint" },
    { label: "Leads", value: stats.leads, color: "bg-somy-coral/10 text-somy-coral" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening across your projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-somy-surface rounded-xl p-6 border border-white/5">
            <p className="text-sm text-gray-400 mb-2">{c.label}</p>
            <p className={`text-3xl font-display font-bold ${c.color.split(" ")[1]}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-somy-surface rounded-xl border border-white/5 p-6">
        <h2 className="font-display text-lg font-bold mb-4">Recent Leads</h2>
        {recentLeads.length === 0 ? (
          <p className="text-gray-500 text-sm">No leads yet. They'll appear here when someone contacts you.</p>
        ) : (
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.email}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    lead.status === "new"
                      ? "bg-somy-accent/10 text-somy-accent-light"
                      : lead.status === "converted"
                      ? "bg-somy-mint/10 text-somy-mint"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
