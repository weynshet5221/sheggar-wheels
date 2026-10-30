"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession, signOut } from "@/lib/auth";
import { getCars } from "@/lib/cars";
import { getBookings } from "@/lib/bookings";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import DashboardSidebar from "@/components/DashboardSidebar";
import { readStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
export default function OwnerDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
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
    const active = getCurrentSession();

    if (!active) {
      router.replace("/signin?next=/owner/dashboard");
      return;
    }

    if (
      active.activeRole !== "owner" &&
      !active.roles?.includes("owner")
    ) {
      router.replace("/signin");
      return;
    }

    setUser(active);
    setCars(getCars({ ownerId: active.id }));
    setBookings(getBookings({ ownerId: active.id }));
  }, [router]);

  function handleSignOut() {
    signOut();
    router.replace("/signin");
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        Loading dashboard...
      </main>
    );
  }

  const earnings = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce(
      (total, booking) => total + Number(booking.subtotal || 0),
      0
    );

  return (
    <DashboardSidebar role="owner" user={user}>
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--text-muted)]">
              Owner dashboard
            </p>
            <h1 className="text-3xl font-bold">
              Welcome, {user.name}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href="/owner/cars/new" className="btn-primary">
              + Add listing
            </Link>
            <button onClick={handleSignOut} className="btn-secondary">
              Sign out
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <section className="panel">
            <p className="text-xs text-[var(--text-muted)]">
              MY CAR LISTINGS
            </p>
            <p className="mt-2 text-3xl font-extrabold">
              {cars.length}
            </p>
            <Link
              href="/owner/cars"
              className="mt-2 inline-block text-sm font-semibold "
            >
              Manage listings
            </Link>
          </section>

          <section className="panel">
            <p className="text-xs text-[var(--text-muted)]">
              MY RENTAL BOOKINGS
            </p>
            <p className="mt-2 text-3xl font-extrabold">
              {bookings.length}
            </p>
            <Link
              href="/owner"
              className="mt-2 inline-block text-sm font-semibold "
            >
              Manage bookings
            </Link>
          </section>

          <section className="panel">
            <p className="text-xs text-[var(--text-muted)]">
              PAID BOOKING SUBTOTALS
            </p>
            <p className="mt-2 text-2xl font-extrabold">
              {formatCurrency(earnings)}
            </p>
            <Link
              href="/owner/earnings"
              className="mt-2 inline-block text-sm font-semibold "
            >
              View earnings
            </Link>
          </section>
        </div>

        <section className="panel space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Bookings for my cars</h2>
            <Link
              href="/owner"
              className="text-sm font-semibold "
            >
              All booking actions
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">
              No bookings received yet.
            </p>
          ) : (
            bookings.map((booking) => {
              const car = cars.find(
                (item) => item.id === booking.carId
              );

              return (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 border-t border-[var(--border-color)] pt-4 sm:flex-row sm:items-center"
                >
                  <img
                    src={car?.photos?.[0] || "/images/cars/sedan.jpg"}
                    alt={car ? `${car.make} ${car.model}` : "Rental car"}
                    className="h-16 w-24 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {car
                        ? `${car.make} ${car.model}`
                        : "Vehicle"}{" "}
                      · Booking #{booking.id}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatDate(booking.startDate)} –{" "}
                      {formatDate(booking.endDate)} · Payment:{" "}
                      {booking.paymentStatus || "pending"}
                    </p>
                  </div>

                  <StatusBadge status={booking.status} />

                  <Link
                    href={`/owner/bookings/${booking.id}`}
                    className="btn-secondary"
                  >
                    View booking
                  </Link>
                </div>
              );
            })
          )}
        </section>

        <section className="panel space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">My vehicle listings</h2>
            <Link
              href="/owner/cars"
              className="text-sm font-semibold "
            >
              Manage all
            </Link>
          </div>

          {cars.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">
              No vehicles listed yet.
            </p>
          ) : (
            cars.map((car) => (
              <Link
                key={car.id}
                href={`/owner/cars/${car.id}`}
                className="flex items-center gap-3 border-t border-[var(--border-color)] pt-3"
              >
                <img
                  src={car.photos?.[0] || "/images/cars/sedan.jpg"}
                  alt=""
                  className="h-14 w-20 rounded-lg object-cover"
                />

                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">
                    {car.make} {car.model}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {formatCurrency(car.pricePerDay)} / day
                  </span>
                </span>

                <StatusBadge status={car.status} />
              </Link>
            ))
          )}
        </section>

        <div className="flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/owner/reviews" className="">
            Customer reviews →
          </Link>
          <Link href="/owner/disputes" className="">
            Disputes →
          </Link>
        </div>
      </main>
    </DashboardSidebar>
  );
}