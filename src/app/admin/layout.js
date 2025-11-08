"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { name: "Books", href: "/admin/dashboard/books", icon: "📚" },
  { name: "Authors", href: "/admin/dashboard/authors", icon: "✍️" },
  { name: "Settings", href: "/admin/dashboard/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#FAF9F5] text-[#3E5E4D]">
      {/* 🌸 Sidebar */}
      <aside className="w-64 bg-[#F5F3EE] border-r border-[#E7DCCB] p-6 flex flex-col justify-between shadow-sm">
        <div>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-2xl font-['Playfair Display'] text-[#3E5E4D] mb-10 hover:text-[#A07B5A] transition"
          >
            <span>🌿</span>
            <span>Mindful Admin</span>
          </Link>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#A8BDA5]/25 text-[#2B2B2B] shadow-sm"
                      : "hover:bg-[#A8BDA5]/10 hover:shadow-sm"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <footer className="text-xs text-[#6B705C] pt-8 border-t border-[#E7DCCB]/60">
          <p>© {new Date().getFullYear()} Mindful Reader</p>
          <p className="italic mt-1 text-[#A07B5A]">Cultivate stillness.</p>
        </footer>
      </aside>

      {/* 🌼 Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header bar */}
        <div className="flex justify-between items-center bg-white border-b border-[#E7DCCB]/60 px-8 py-4 shadow-sm">
          <h2 className="text-xl font-['Playfair Display'] font-semibold text-[#3E5E4D] capitalize tracking-wide">
            {pathname.split("/").pop() || "Dashboard"}
          </h2>
          {/* Optional placeholder for Add button or future controls */}
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto px-8 py-10 animate-fadeIn">
          {children}
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
