"use client";

import { Mail, ShieldCheck } from "lucide-react";

type Props = {
  profile: any;
  email: string;
  joined: string;
};

export default function CrewSettingsForm({ profile, email, joined }: Props) {
  console.log(profile, "ppp");

  const joinedDate = joined
    ? new Date(joined).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 md:p-8">
      <div className="space-y-6">
        {/* Email */}
        <div>
          <label className="text-sm text-white/60 mb-2 block">
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="email"
              value={email}
              disabled
              className="w-full h-12 rounded-xl bg-[#0d0e10] border border-white/[0.06] pl-11 pr-4 text-sm text-white/40 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="text-sm text-white/60 mb-2 block">Role</label>

          <div className="relative">
            <ShieldCheck
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
            />

            <div className="w-full h-12 rounded-xl bg-[#0d0e10] border border-white/[0.06] pl-11 pr-4 text-sm text-cyan-400 flex items-center capitalize">
              {profile?.role || "crew"}
            </div>
          </div>
        </div>

        {/* Joined Since */}
        <div>
          <label className="text-sm text-white/60 mb-2 block">
            Joined Since
          </label>

          <div className="h-12 rounded-xl bg-[#0d0e10] border border-white/[0.06] px-4 flex items-center text-sm text-white/70">
            {joinedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
