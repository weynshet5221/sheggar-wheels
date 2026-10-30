
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";

const menus = {
  renter: [
    { label: "Dashboard", href: "/renter/dashboard", icon: "▦" },
    { label: "Browse Cars", href: "/cars", icon: "⌕" },
    { label: "My Bookings", href: "/bookings", icon: "▤" },
    { label: "Announcements", href: "/announcements", icon: "⚑" },
  ],
  owner: [
    { label: "Dashboard", href: "/owner/dashboard", icon: "▦" },
    { label: "Browse Cars", href: "/cars", icon: "⌕" },
    { label: "My Cars", href: "/owner/cars", icon: "🚘" },
    { label: "Booking Requests", href: "/owner", icon: "▤" },
    { label: "Earnings", href: "/owner/earnings", icon: "◫" },
    { label: "Reviews", href: "/owner/reviews", icon: "☆" },
    { label: "Disputes", href: "/owner/disputes", icon: "!" },
    { label: "Announcements", href: "/announcements", icon: "⚑" },
  ],
  admin: [
    { label: "Users", href: "/admin/users", icon: "♙" },
    { label: "Car Listings", href: "/admin/listings", icon: "🚘" },
    { label: "Bookings", href: "/admin/booking", icon: "▤" },
    { label: "Disputes", href: "/admin/disputes", icon: "!" },
    { label: "Reports", href: "/admin/reports", icon: "▥" },
    { label: "Announcements", href: "/admin/announcements", icon: "⚑" },
    { label: "Marketplace", href: "/cars", icon: "⌕" },
  ],
};

const roleNames = {
  renter: "Renter",
  owner: "Car Owner",
  admin: "Administrator",
};

export default function DashboardSidebar({ role, user, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
const normalizedRole = String(role || "renter").toLowerCase();

const links = menus[normalizedRole] || menus.renter;
const displayRole = roleNames[normalizedRole] || "Dashboard";

  function handleSignOut() {
    signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5f7f5] md:flex">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-[#172d22] px-4 py-3 text-white md:hidden">
        <Link href="/" className="text-lg font-bold">
          Sheggar <span className="text-[#a9c4ad]">Wheels</span>
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="min-h-11 min-w-11 rounded-lg border border-white/30 px-3 py-2 text-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </header>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#172d22] text-white transition-transform duration-200 md:sticky md:top-0 md:z-30 md:h-screen md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <p className="mt-5 text-xs uppercase tracking-widest text-[#a9c4ad]">
          {displayRole}
          </p>
          <p className="mt-2 truncate font-semibold">{user?.name || "Account"}</p>

        </div>

        <nav
          aria-label={`${displayRole} navigation`}
          className="flex-1 space-y-1 overflow-y-auto p-4"
        >
          {links.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isActive
                    ? "bg-white font-bold text-[#172d22]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="w-5 text-center" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-11 w-full rounded-xl border border-white/20 px-4 py-3 text-left text-sm font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
