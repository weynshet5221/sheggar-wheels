"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { getBookings } from "@/lib/bookings";
import { getCarById } from "@/lib/cars";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useRouter } from "next/navigation";
import { readStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
export default function RenterDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedAnnouncements = readStorage(
  STORAGE_KEYS.ANNOUNCEMENTS,
  []
);

setAnnouncements(
  Array.isArray(savedAnnouncements)
    ? savedAnnouncements.filter((item) => item.active !== false)
    : []
);
    const activeUser = getCurrentSession();

    if (!activeUser) {
      window.location.href = "/signin?next=/renter/dashboard";
      return;
    }

    if (
      activeUser.activeRole !== "renter" &&
      !activeUser.roles?.includes("renter")
    ) {
      const destinations = {
        owner: "/owner/dashboard",
        admin: "/admin/dashboard",
      };

      window.location.href =
        destinations[activeUser.activeRole] || "/signin";

      return;
    }

    setUser(activeUser);
    setBookings(getBookings({ renterId: activeUser.id }));
  }, []);

  if (!user) return null;

  return (
    <DashboardSidebar role="renter" user={user}>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        <h1 className="text-3xl font-bold">Renter Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="panel p-6">
            <span className="text-xs text-[var(--text-muted)]">
              TOTAL BOOKINGS
            </span>
            <p className="text-3xl font-extrabold">
              {bookings.length}
            </p>
          </div>

          <div className="panel p-6">
            <span className="text-xs text-[var(--text-muted)]">
              TOTAL SPENT
            </span>
            <p className="text-3xl font-extrabold">
              {formatCurrency(
                bookings.reduce(
                  (total, booking) =>
                    total +
                    (booking.paymentStatus === "paid"
                      ? Number(booking.total || 0)
                      : 0),
                  0
                )
              )}
            </p>
          </div>
        </div>

        <div className="panel p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">My Rentals</h2>
            <Link
              href="/bookings"
              className="text-sm font-semibold "
            >
              View all bookings
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">
              No rental bookings yet.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border-color)]">
              {bookings.map((booking) => {
                const car = getCarById(booking.carId);

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between gap-3 py-4"
                  >
                    <img
                      src={car?.photos?.[0] || "/images/cars/sedan.jpg"}
                      alt={car ? `${car.make} ${car.model}` : "Rental car"}
                      className="h-14 w-20 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        {car
                          ? `${car.make} ${car.model}`
                          : `Booking #${booking.id}`}
                      </p>

                      <p className="text-xs text-[var(--text-muted)]">
                        {formatDate(booking.startDate)} to{" "}
                        {formatDate(booking.endDate)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={booking.status} />

                      <Link
                        href={`/bookings/${booking.id}`}
                        className="text-xs font-semibold "
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardSidebar >
  );
}