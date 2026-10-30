"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession, signOut } from "@/lib/auth";
import { readStorage, writeStorage, initializeDemoData } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import DashboardSidebar from "@/components/DashboardSidebar";
import { formatCurrency } from "@/lib/format";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function loadDashboardData() {
    const usersData = readStorage(STORAGE_KEYS.USERS, []);
    const carsData = readStorage(STORAGE_KEYS.CARS, []);
    const bookingsData = readStorage(STORAGE_KEYS.BOOKINGS, []);
    const announcementsData = readStorage(STORAGE_KEYS.ANNOUNCEMENTS, []);
    setAccounts(Array.isArray(usersData) ? usersData : []);
    setCars(Array.isArray(carsData) ? carsData : []);
    setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    setAnnouncements(Array.isArray(announcementsData) ? announcementsData.filter((item) => item.active !== false) : []);
  }

  useEffect(() => {
    initializeDemoData();
    const activeUser = getCurrentSession();

    if (!activeUser) {
      router.replace("/signin?next=/admin/dashboard");
      return;
    }
    if (activeUser.activeRole !== "admin") {
      const destinations = { renter: "/renter/dashboard", owner: "/owner/dashboard" };
      router.replace(destinations[activeUser.activeRole] || "/");
      return;
    }

    setSession(activeUser);
    loadDashboardData();
  }, [router]);

  function publishAnnouncement(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const activeUser = getCurrentSession();
    if (!activeUser || activeUser.activeRole !== "admin" || activeUser.id !== session?.id) {
      setError("Not authorized: only the active admin demo account can publish announcements.");
      return;
    }

    const cleanMessage = announcement.trim();
    if (!cleanMessage) {
      setError("Write an announcement before publishing.");
      return;
    }

    const current = readStorage(STORAGE_KEYS.ANNOUNCEMENTS, []);
    const safeCurrent = Array.isArray(current) ? current : [];
    const newAnnouncement = {
      id: `ann-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
      title: "Marketplace Announcement",
      message: cleanMessage,
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: session.id,
    };

    writeStorage(STORAGE_KEYS.ANNOUNCEMENTS, [newAnnouncement, ...safeCurrent]);
    setAnnouncement("");
    setMessage("Demo announcement published successfully.");
    loadDashboardData();
  }

  function handleSignOut() {
    signOut();
    router.replace("/");
  }

  if (!session) {
    return <main className="px-6 py-10 text-sm text-gray-600">Loading administrator dashboard…</main>;
  }

  const activeAccounts = accounts.filter((account) => account.status !== "suspended").length;
  const pendingCars = cars.filter((car) => car.status === "pending").length;
  const platformFee = bookings.reduce((sum, booking) => sum + Number(booking.fee || 0), 0);

  return (
    <DashboardSidebar role="admin" user={session}>
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Administration </p>
            <h1 className="mt-1 text-3xl font-bold text-[#172d22]">Platform dashboard</h1>
          </div>
          <button type="button" onClick={handleSignOut} className="min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold">Sign out</button>
        </header>

        <section aria-label="Platform metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Total users", accounts.length],
            ["Active users", activeAccounts],
            ["Car listings", cars.length],
            ["Pending listings", pendingCars],
            ["Recorded platform fees", formatCurrency(platformFee)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-3 text-2xl font-extrabold text-[#172d22]">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#172d22]">Platform management</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">Admin demo role</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["/admin/users", "Manage users", "Review demo accounts and status."],
              ["/admin/listings", "Moderate listings", `${pendingCars} listing(s) waiting for review.`],
              ["/admin/booking", "View bookings", `${bookings.length} booking record(s).`],
              ["/admin/disputes", "Review disputes", "Inspect and resolve demo disputes."],
              ["/admin/reports", "Reports and exports", "Inspect platform reporting."],
              ["/admin/announcements", "Announcements", "Manage marketplace updates."],
              ["/cars", "Public marketplace", "Browse approved public listings."],
            ].map(([href, title, description]) => (
              <Link key={href} href={href} className="rounded-xl border p-4 hover:border-[#7c9a82] hover:bg-gray-50">
                <h3 className="font-bold text-[#172d22]">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border bg-white p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-[#172d22]">Recent announcements</h2>
          {announcements.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-5 text-sm text-gray-600">No active announcements have been published.</p>
          ) : (
            <div className="divide-y">
              {announcements.slice(0, 5).map((item) => (
                <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="font-semibold">{item.title || "Marketplace Announcement"}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.message || item.text}</p>
                  <p className="mt-2 text-xs text-gray-500">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </DashboardSidebar>
  );
}
