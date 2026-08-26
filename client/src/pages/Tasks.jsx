import { useEffect, useState } from "react";
import api from "../api/client";

const COLUMNS = [
  { key: "backlog", label: "Backlog", color: "border-gray-500" },
  { key: "in_progress", label: "In Progress", color: "border-somy-gold" },
  { key: "review", label: "Review", color: "border-somy-accent" },
  { key: "done", label: "Done", color: "border-somy-mint" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", projectId: "", assigneeId: "", dueDate: "" });
  const [draggedTask, setDraggedTask] = useState(null);

  const loadData = async () => {
    try {
      const [tasksRes, projectsRes, teamRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
        api.get("/team"),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setTeam(teamRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", {
        ...form,
        projectId: form.projectId || projects[0]?.id,
        assigneeId: form.assigneeId || null,
        dueDate: form.dueDate || null,
      });
      setForm({ title: "", description: "", projectId: "", assigneeId: "", dueDate: "" });
      setShowForm(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || "Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      handleStatusChange(draggedTask.id, status);
    }
    setDraggedTask(null);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-somy-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Tasks</h1>
          <p className="text-gray-400 text-sm mt-1">Drag tasks between columns to update status</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-somy-accent hover:bg-somy-accent-light transition text-sm font-medium"
        >
          {showForm ? "Cancel" : "+ New Task"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-somy-surface rounded-xl p-6 border border-white/5 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-somy-navy border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-somy-accent transition text-sm"
                placeholder="Task title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
              <select
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                className="w-full bg-somy-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-somy-accent transition text-sm"
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
              <select
                value={form.assigneeId}
                onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                className="w-full bg-somy-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-somy-accent transition text-sm"
              >
                <option value="">Unassigned</option>
                {team.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-somy-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-somy-accent transition text-sm"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full bg-somy-navy border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-somy-accent transition text-sm resize-none"
              placeholder="Optional description"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-somy-accent hover:bg-somy-accent-light transition text-sm font-medium"
          >
            Create Task
          </button>
        </form>
      )}

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-0 overflow-hidden">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              className="flex flex-col bg-somy-surface rounded-xl border border-white/5 overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              <div className={`px-4 py-3 border-b-2 ${col.color} flex items-center justify-between`}>
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="bg-somy-navy rounded-lg p-3 border border-white/5 hover:border-white/10 cursor-grab active:cursor-grabbing transition group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium flex-1">{task.title}</h4>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-somy-coral text-xs ml-2 transition"
                      >
                        ✕
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {task.project && (
                          <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{task.project.name}</span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                      {task.assignee && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ backgroundColor: task.assignee.avatarColor || "#6366f1" }}
                          title={task.assignee.name}
                        >
                          {task.assignee.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-8">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
