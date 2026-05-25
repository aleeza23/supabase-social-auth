import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CrewSettingsForm from "../_components/crew-settings-form";

export default async function CrewSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#080809] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-cyan-400 text-sm uppercase tracking-[0.2em]">
            Crew Settings
          </p>

          <h1
            className="text-3xl md:text-4xl font-bold mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Profile Settings
          </h1>

          <p className="text-white/40 mt-2">
            Manage your crew account information.
          </p>
        </div>

        <CrewSettingsForm profile={profile} email={user.email || ""} joined={user?.confirmed_at || ""} />
      </div>
    </div>
  );
}
