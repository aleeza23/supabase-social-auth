"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: string;
  email: string;
  role: "user" | "crew" | "admin";
};

export default function CrewManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
console.log(profiles);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();

      if (res.ok) {
        setProfiles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (
    userId: string,
    role: "user" | "crew" | "admin",
  ) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }

      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === userId
            ? { ...profile, role }
            : profile,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Crew Management
          </h1>

          <p className="text-white/50 mt-2">
            Manage user roles and crew access
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-12 border-b border-white/10 px-6 py-4 text-sm uppercase tracking-wider text-white/40">
            <div className="col-span-5">
              Email
            </div>

            <div className="col-span-3">
              Current Role
            </div>

            <div className="col-span-4">
              Change Role
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="grid grid-cols-12 items-center px-6 py-5"
              >
                <div className="col-span-5">
                  <p className="text-white font-medium">
                    {profile.email}
                  </p>
                </div>

                <div className="col-span-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      profile.role === "admin"
                        ? "bg-red-500/20 text-red-300"
                        : profile.role === "crew"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {profile.role}
                  </span>
                </div>

                <div className="col-span-4">
                  <select
                    value={profile.role}
                    onChange={(e) =>
                      updateRole(
                        profile.id,
                        e.target.value as
                          | "user"
                          | "crew"
                          | "admin",
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2 text-white outline-none focus:border-amber-400"
                  >
                    <option value="user">
                      User
                    </option>

                    <option value="crew">
                      Crew
                    </option>

                    <option value="admin">
                      Admin
                    </option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}