"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Settings,
  Users,
  Package2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Package2,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="text-black font-black text-sm">A</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Admin
            </p>
            <p className="text-white/30 text-xs mt-0.5">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] px-3 py-2">
          Menu
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative
                ${active
                  ? "bg-amber-400/10 text-amber-400"
                  : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                }`}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 1.5} />
              <span className="flex-1">{label}</span>
              {active && (
                <ChevronRight size={12} className="text-amber-400/60" />
              )}
              {/* Active bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all w-full"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-[#0a0a0c] border-r border-white/[0.06] min-h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0a0a0c] border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
            <span className="text-black font-black text-xs">A</span>
          </div>
          <span className="text-white font-bold text-sm"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin
          </span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-white/40 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0a0a0c] border-r border-white/[0.06] flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
                  <span className="text-black font-black text-xs">A</span>
                </div>
                <span className="text-white font-bold text-sm"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Admin
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-white/30 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          </div>
        </>
      )}
    </>
  );
}