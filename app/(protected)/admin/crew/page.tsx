"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { log } from "node:console";

type Crew = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export default function ManageCrewPage() {
  const [crew, setCrew] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const fetchCrew = async () => {
    setLoading(true);

    const res = await fetch("/api/admin/crew");
    const data = await res.json();

    setCrew(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCrew();
  }, []);

  const createCrew = async () => {
    const res = await fetch("/api/admin/crew", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    console.log(res, 'create res');
    

    if (res.ok) {
      setForm({
        email: "",
        password: "",
      });

      fetchCrew();
    }
  };

  const deleteCrew = async (id: string) => {
    await fetch(`/api/admin/crew/${id}`, {
      method: "DELETE",
    });

    fetchCrew();
  };

  return (
    <div
      className="min-h-screen bg-[#080809] text-white p-6 md:p-10"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p
            className="text-xs text-amber-400/60 tracking-[0.3em] uppercase mb-1"
            style={{ fontFamily: "system-ui" }}
          >
            Admin
          </p>

          <h1 className="text-3xl font-bold">
            Manage Crew
          </h1>
        </div>

        <div className="flex items-center gap-2 text-amber-400">
          <Users size={20} />
          <span>{crew.length} Crew Members</span>
        </div>
      </div>

      {/* Create Crew */}
      <div className="rounded-2xl bg-[#0e0e11] border border-white/[0.06] p-6 mb-8">
        <h2 className="text-lg font-semibold mb-5">
          Add Crew Member
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none"
          />

          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none"
          />
        </div>

        <button
          onClick={createCrew}
          className="mt-5 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
          style={{ fontFamily: "system-ui" }}
        >
          <Plus size={16} />
          Add Crew
        </button>
      </div>

      {/* Crew Table */}
      <div className="rounded-2xl bg-[#0e0e11] border border-white/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold">
            Crew Members
          </h2>
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center text-white/20">
            Loading...
          </div>
        ) : (
          <table
            className="w-full"
            style={{ fontFamily: "system-ui" }}
          >
            <thead>
              <tr className="text-left text-xs text-white/20 uppercase tracking-widest border-b border-white/[0.06]">
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {crew.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-white/[0.04]"
                >

                  <td className="px-6 py-4 text-white/50">
                    {member.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full text-xs">
                      {member.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-400/10 transition-all">
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() =>
                          deleteCrew(member.id)
                        }
                        className="p-2 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}