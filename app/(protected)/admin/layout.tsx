import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("USER:", user);

  if (!user) redirect("/auth/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("PROFILE:", profile);
  console.log("ERROR:", error);
  
  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      <div className="flex min-h-screen bg-[#080809]">
        <AdminSidebar />
        <main className="flex-1 md:pt-0 pt-14 overflow-auto">{children}</main>
      </div>
    </>
  );
}
