import { useEffect, useState } from "react";
import api from "../api/client";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/team");
        setTeam(data);
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Team</h1>
        <p className="text-gray-400 text-sm mt-1">{team.length} founding partners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map((member) => (
          <div key={member.id} className="bg-somy-surface rounded-xl p-6 border border-white/5 hover:border-white/10 transition">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: member.avatarColor || "#6366f1" }}
              >
                {member.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">{member.name}</h3>
                <p className="text-sm text-gray-400">{member.email}</p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-somy-accent/10 text-somy-accent-light capitalize">
                  {member.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
