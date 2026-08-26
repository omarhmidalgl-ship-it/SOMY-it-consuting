import { useEffect, useState } from "react";
import api from "../api/client";

const STATUS_COLORS = {
  lead: "bg-somy-accent/10 text-somy-accent-light",
  active: "bg-somy-mint/10 text-somy-mint",
  paused: "bg-somy-gold/10 text-somy-gold",
  done: "bg-white/5 text-gray-400",
};

const PLATFORM_COLORS = {
  web: "bg-blue-500/10 text-blue-400",
  mobile: "bg-orange-500/10 text-orange-400",
  desktop: "bg-emerald-500/10 text-emerald-400",
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", clientName: "", platforms: [] });
  const [filter, setFilter] = useState("all");

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", form);
      setForm({ name: "", clientName: "", platforms: [] });
      setShowForm(false);
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create project");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/projects/${id}`, { status });
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePlatform = (p) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));
  };

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-somy-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">{projects.length} total projects</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-somy-accent hover:bg-somy-accent-light transition text-sm font-medium"
        >
          {showForm ? "Cancel" : "+ New Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-somy-surface rounded-xl p-6 border border-white/5 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-somy-navy border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-somy-accent transition text-sm"
                placeholder="Project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Client Name</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className="w-full bg-somy-navy border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-somy-accent transition text-sm"
                placeholder="Client name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Platforms</label>
            <div className="flex gap-3">
              {["web", "mobile", "desktop"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                    form.platforms.includes(p)
                      ? `${PLATFORM_COLORS[p]} border-current`
                      : "bg-somy-navy border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-somy-accent hover:bg-somy-accent-light transition text-sm font-medium"
          >
            Create Project
          </button>
        </form>
      )}

      <div className="flex gap-2 mb-6">
        {["all", "lead", "active", "paused", "done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === f ? "bg-somy-accent text-white" : "bg-somy-surface text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-12">No projects found.</p>
        ) : (
          filtered.map((project) => (
            <div key={project.id} className="bg-somy-surface rounded-xl p-5 border border-white/5 hover:border-white/10 transition">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[project.status]}`}>
                      {project.status}
                    </span>
                  </div>
                  {project.clientName && (
                    <p className="text-sm text-gray-400 mb-2">Client: {project.clientName}</p>
                  )}
                  <div className="flex gap-2">
                    {project.platforms.map((p) => (
                      <span key={p} className={`text-xs px-2 py-0.5 rounded-full ${PLATFORM_COLORS[p] || "bg-white/5 text-gray-400"}`}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 mr-2">{project._count?.tasks || 0} tasks</span>
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    className="bg-somy-navy border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-somy-accent"
                  >
                    <option value="lead">Lead</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
