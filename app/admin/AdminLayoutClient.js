"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutClient({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;


  return (
    <div className="flex h-screen bg-stone-100">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 md:relative md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col overflow-auto">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-1.5 text-stone-600 hover:bg-stone-100"
            aria-label="Meniu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="font-display text-base font-semibold text-stone-900">
            PrimNord Admin
          </span>
        </div>

        <div className="min-h-full p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
