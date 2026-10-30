"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { readStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const activeUser = getCurrentSession();

    if (!activeUser) {
      router.replace("/signin");
      return;
    }

    if (!["owner", "renter"].includes(activeUser.activeRole)) {
      router.replace("/admin/dashboard");
      return;
    }

    setUser(activeUser);

    const savedAnnouncements = readStorage(
      STORAGE_KEYS.ANNOUNCEMENTS,
      []
    );

    setAnnouncements(
      Array.isArray(savedAnnouncements)
        ? savedAnnouncements
            .filter((item) => item.active !== false)
            .sort(
              (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
            )
        : []
    );
  }, [router]);

  if (!user) {
    return (
      <main className="p-8 text-sm text-gray-600">
        Loading announcements...
      </main>
    );
  }
  return (
    <DashboardSidebar role={user.activeRole} user={user}>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
        <header>
          <h1 className="text-3xl font-bold text-[#193d2b]">
            Announcements
          </h1>
        </header>
        {announcements.length === 0 ? (
          <section className="rounded-2xl border bg-white p-8 text-center">
            <p className="text-lg font-semibold text-[#193d2b]">
              No announcements yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Admin announcements will appear here.
            </p>
          </section>
        ) : (
          <div className="space-y-4">
            {announcements.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf0e9] text-lg text-[#193d2b]">
                    ⚑
                  </span>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-[#193d2b]">
                      {item.title || "Marketplace Announcement"}
                    </h2>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {item.message || item.text}
                    </p>

                    <p className="mt-3 text-xs text-gray-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </DashboardSidebar>
  );
}
