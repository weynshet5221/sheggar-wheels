"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { getBookings } from "@/lib/bookings";
import { getCarById } from "@/lib/cars";
import { formatCurrency, formatDate } from "@/lib/format";
import { exportToCSV } from "@/lib/csv";
import StatusBadge from "@/components/StatusBadge";

export default function RenterBookingsPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const activeUser = getCurrentSession();

    if (!activeUser) {
      window.location.href = "/signin?next=/bookings";
      return;
    }

    setUser(activeUser);
    setBookings(
      getBookings({
        renterId: activeUser.id,
        status: statusFilter || undefined,
      })
    );
  }, [statusFilter]);

  if (!user) return null;

  function handleExport() {
    const rows = bookings.map((booking) => ({
      BookingID: booking.id,
      CarID: booking.carId,
      StartDate: booking.startDate,
      EndDate: booking.endDate,
      Days: booking.days,
      TotalETB: booking.total,
      Status: booking.status,
    }));

    exportToCSV("my_booking_history.csv", rows);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">My Booking History</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Review past and upcoming vehicle rentals.
          </p>
        </div>

        <button onClick={handleExport} className="btn-primary">
          Export Booking History (CSV)
        </button>
      </div>

      <div className="panel flex items-center gap-4">
        <label className="text-xs font-semibold text-[var(--text-muted)]">
          FILTER STATUS:
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-[var(--border-color)] bg-transparent px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="reviewed">Reviewed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="panel overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text-muted)]">
            No bookings found for this filter.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {bookings.map((booking) => {
              const car = getCarById(booking.carId);

              return (
                <div
                  key={booking.id}
                  className="flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center"
                >
                  <img
                    src={car?.photos?.[0] || "/images/cars/sedan.jpg"}
                    alt={car ? `${car.make} ${car.model}` : "Rental car"}
                    className="h-16 w-24 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-bold">
                      {car
                        ? `${car.make} ${car.model}`
                        : `Booking Ref: ${booking.id}`}
                    </p>

                    <p className="text-xs text-[var(--text-muted)]">
                      {formatDate(booking.startDate)} →{" "}
                      {formatDate(booking.endDate)} ({booking.days} Days)
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatCurrency(booking.total)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} />

                    <Link
                      href={`/bookings/${booking.id}`}
                      className="btn-secondary"
                    >
                      View booking
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}