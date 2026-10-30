"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getCars } from "@/lib/cars";
import { getBookings, updateBookingStatus } from "@/lib/bookings";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export default function OwnerOverviewPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [myCars, setMyCars] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  function refresh(active) {
    setMyCars(getCars({ ownerId: active.id }));
    setRequests(getBookings({ ownerId: active.id }));
  }

  useEffect(() => {
    const active = getCurrentSession();

    if (!active) {
      router.replace("/signin?next=/owner");
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
    refresh(active);
  }, [router]);

  function act(id, status) {
    try {
      setError("");
      updateBookingStatus(id, status, user.id);
      refresh(user);
    } catch (err) {
      setError(err.message || "Could not update booking.");
    }
  }

  if (!user) {
    return <main className="px-6 py-10">Loading owner workspace...</main>;
  }

  const earnings = requests
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce(
      (sum, booking) => sum + Number(booking.subtotal || 0),
      0
    );

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Owner workspace</p>
          <h1 className="text-3xl font-bold">Owner dashboard</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Manage listings, booking requests and returns.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/owner/cars" className="btn-secondary">
            Manage listings
          </Link>
          <Link href="/owner/reviews" className="btn-secondary">
            Customer reviews
          </Link>
          <Link href="/owner/cars/new" className="btn-primary">
            + Add new listing
          </Link>
        </div>
      </header>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="panel">
          <p className="text-sm text-[var(--text-muted)]">Listed vehicles</p>
          <p className="text-3xl font-bold">{myCars.length}</p>
        </div>

        <div className="panel">
          <p className="text-sm text-[var(--text-muted)]">Pending requests</p>
          <p className="text-3xl font-bold">
            {requests.filter((booking) => booking.status === "requested").length}
          </p>
        </div>

        <div className="panel">
          <p className="text-sm text-[var(--text-muted)]">
            Paid booking subtotal
          </p>
          <p className="text-2xl font-bold">{formatCurrency(earnings)}</p>
        </div>
      </section>

      <section className="panel space-y-4">
        <h2 className="text-xl font-bold">Bookings and rental requests</h2>

        {requests.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            No rental requests yet.
          </p>
        ) : (
          requests.map((booking) => {
            const car = myCars.find(
              (item) => item.id === booking.carId
            );

            return (
              <article
                key={booking.id}
                className="flex flex-col gap-3 border-t border-[var(--border-color)] pt-4 sm:flex-row sm:items-center"
              >
                <img
                  src={car?.photos?.[0] || "/images/cars/sedan.jpg"}
                  alt={car ? `${car.make} ${car.model}` : "Vehicle"}
                  className="h-16 w-24 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-bold">
                    {car ? `${car.make} ${car.model}` : "Vehicle"} · Booking #
                    {booking.id}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {formatDate(booking.startDate)} –{" "}
                    {formatDate(booking.endDate)} ·{" "}
                    {formatCurrency(booking.total)} · Payment:{" "}
                    {booking.paymentStatus || "pending"}
                  </p>
                </div>

                <StatusBadge status={booking.status} />

                <div className="flex flex-wrap gap-2">
                  {booking.status === "requested" && (
                    <>
                      <button
                        className="btn-primary"
                        onClick={() => act(booking.id, "confirmed")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => act(booking.id, "declined")}
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {booking.status === "confirmed" &&
                    booking.paymentStatus === "paid" && (
                      <button
                        className="btn-primary"
                        onClick={() => act(booking.id, "in_progress")}
                      >
                        Start rental
                      </button>
                    )}

                  {booking.status === "confirmed" &&
                    booking.paymentStatus !== "paid" && (
                      <span className="text-xs text-amber-700">
                        Awaiting payment
                      </span>
                    )}

                  {booking.status === "in_progress" && (
                    <button
                      className="btn-primary"
                      onClick={() => act(booking.id, "completed")}
                    >
                      Confirm return
                    </button>
                  )}

                  <Link
                    href={`/owner/bookings/${booking.id}`}
                    className="btn-secondary"
                  >
                    View details
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </section>

      <section className="panel space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">My vehicles</h2>
          <Link
            href="/owner/cars"
            className="text-sm font-semibold underline"
          >
            Manage all
          </Link>
        </div>

        {myCars.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            No vehicles listed yet.
          </p>
        ) : (
          myCars.map((car) => (
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
    </main>
  );
}