"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import {
  getBookings,
  updateBookingStatus,
} from "@/lib/bookings";
import { getCarById } from "@/lib/cars";
import { readStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export default function OwnerBookingDetailPage({ params }) {
  return (
    <Suspense fallback={<main>Loading booking...</main>}>
      <OwnerBookingDetailContent params={params} />
    </Suspense>
  );
}

function OwnerBookingDetailContent({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [car, setCar] = useState(null);
  const [renter, setRenter] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
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

    const found = getBookings({ ownerId: active.id }).find(
      (item) => String(item.id) === String(id)
    );

    if (found) {
      setBooking(found);
      setCar(getCarById(found.carId));

      const users = readStorage(STORAGE_KEYS.USERS, []);
      setRenter(
        users.find((item) => item.id === found.renterId) || null
      );
    }
  }, [id, router]);

  function changeStatus(status) {
    try {
      setError("");
      setBooking({
        ...updateBookingStatus(booking.id, status, user.id),
      });
    } catch (err) {
      setError(err.message || "Could not update booking.");
    }
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        Loading booking...
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-xl font-bold">Booking not found</h1>
        <Link
          href="/owner/dashboard"
          className="btn-secondary mt-4 inline-flex"
        >
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <Link
        href="/owner/dashboard"
        className="text-sm font-semibold underline"
      >
        ← Back to owner dashboard
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Owner booking management</p>
          <h1 className="text-2xl font-bold">
            Booking #{booking.id}
          </h1>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="panel flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          src={car?.photos?.[0] || "/images/cars/sedan.jpg"}
          alt="Booked vehicle"
          className="h-28 w-full rounded-xl object-cover sm:w-40"
        />
        <div>
          <h2 className="text-xl font-bold">
            {car ? `${car.make} ${car.model}` : "Vehicle"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {car?.year} · {car?.neighbourhood}, Addis Ababa
          </p>
          <p className="mt-1 font-semibold">
            {formatCurrency(car?.pricePerDay || booking.pricePerDay)} / day
          </p>
        </div>
      </section>

      <section className="panel space-y-3">
        <h2 className="font-bold">Renter information</h2>
        <p className="text-sm">{renter?.name || "Renter"}</p>
        <p className="text-sm text-[var(--text-muted)]">
          {renter?.email || "No email available"}
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          {renter?.phone || "No phone available"}
        </p>
      </section>

      <section className="panel space-y-3">
        <h2 className="font-bold">Rental and payment summary</h2>

        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p>Pickup: {formatDate(booking.startDate)}</p>
          <p>Return: {formatDate(booking.endDate)}</p>
          <p>Duration: {booking.days} days</p>
          <p>
            Payment:{" "}
            <strong className="capitalize">
              {booking.paymentStatus || "pending"}
            </strong>
          </p>
        </div>

        <div className="border-t border-[var(--border-color)] pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(booking.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>{formatCurrency(booking.fee)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-[var(--border-color)] pt-2 font-bold">
            <span>Total</span>
            <span>{formatCurrency(booking.total)}</span>
          </div>
        </div>

        {booking.transactionRef && (
          <p className="text-xs text-[var(--text-muted)]">
            Payment reference: {booking.transactionRef}
          </p>
        )}
      </section>

      <section className="panel">
        <h2 className="mb-3 font-bold">Booking actions</h2>

        <div className="flex flex-wrap gap-2">
          {booking.status === "requested" && (
            <>
              <button
                onClick={() => changeStatus("confirmed")}
                className="btn-primary"
              >
                Approve request
              </button>
              <button
                onClick={() => changeStatus("declined")}
                className="btn-danger"
              >
                Decline request
              </button>
            </>
          )}

          {booking.status === "confirmed" &&
            booking.paymentStatus !== "paid" && (
              <p className="text-sm text-amber-700">
                Waiting for renter payment before vehicle handover.
              </p>
            )}

          {booking.status === "confirmed" &&
            booking.paymentStatus === "paid" && (
              <button
                onClick={() => changeStatus("in_progress")}
                className="btn-primary"
              >
                Start rental / hand over
              </button>
            )}

          {booking.status === "in_progress" && (
            <button
              onClick={() => changeStatus("completed")}
              className="btn-primary"
            >
              Confirm car returned
            </button>
          )}

          {booking.status === "completed" && (
            <p className="text-sm text-emerald-700">
              Rental completed. The renter can now leave a review.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}