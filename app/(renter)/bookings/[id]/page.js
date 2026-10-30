"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getBookings, updateBookingStatus } from "@/lib/bookings";
import { getCarById } from "@/lib/cars";
import { getReviews } from "@/lib/reviews";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export default function BookingDetailPage({ params }) {
  return (
    <Suspense fallback={<main>Loading booking...</main>}>
      <BookingDetailContent params={params} />
    </Suspense>
  );
}

function BookingDetailContent({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [car, setCar] = useState(null);
  const [reviewExists, setReviewExists] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const activeUser = getCurrentSession();

    if (!activeUser) {
      router.replace(`/signin?next=/bookings/${id}`);
      return;
    }

    if (
      activeUser.activeRole !== "renter" &&
      !activeUser.roles?.includes("renter")
    ) {
      router.replace("/signin");
      return;
    }

    setUser(activeUser);

    const found = getBookings({ renterId: activeUser.id }).find(
      (item) => String(item.id) === String(id)
    );

    if (found) {
      setBooking(found);
      setCar(getCarById(found.carId));
      setReviewExists(getReviews({ bookingId: found.id }).length > 0);
    }
  }, [id, router]);

  function cancelBooking() {
    try {
      const updated = updateBookingStatus(
        booking.id,
        "cancelled",
        user.id
      );
      setBooking({ ...updated });
    } catch (err) {
      setError(err.message);
    }
  }

  if (!user) {
    return <main className="mx-auto max-w-4xl px-4 py-16">Loading booking...</main>;
  }

  if (!booking) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-xl font-bold">Booking not found</h1>
        <Link
          className="btn-secondary mt-4 inline-block"
          href="/renter/dashboard"
        >
          Back to dashboard
        </Link>
      </main>
    );
  }

  const isPaid = booking.paymentStatus === "paid";

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Your rental</p>
          <h1 className="text-2xl font-bold">Booking details</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Reference: {booking.id}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="panel flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          src={car?.photos?.[0] || "/images/cars/sedan.jpg"}
          alt={`${car?.make || "Rental"} ${car?.model || "car"}`}
          className="h-28 w-full rounded-xl object-cover sm:w-40"
        />
        <div className="min-w-0">
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

      <section className="panel space-y-4">
        <h2 className="text-lg font-bold">Rental summary</h2>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-[var(--text-muted)]">Pickup date:</span>{" "}
            {formatDate(booking.startDate)}
          </p>
          <p>
            <span className="text-[var(--text-muted)]">Return date:</span>{" "}
            {formatDate(booking.endDate)}
          </p>
          <p>
            <span className="text-[var(--text-muted)]">Duration:</span>{" "}
            {booking.days} days
          </p>
          <p>
            <span className="text-[var(--text-muted)]">Payment:</span>{" "}
            <strong className="capitalize">
              {booking.paymentStatus || "pending"}
            </strong>
          </p>
        </div>

        <div className="space-y-2 border-t border-[var(--border-color)] pt-4 text-sm">
          <div className="flex justify-between">
            <span>Rental subtotal</span>
            <span>{formatCurrency(booking.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>{formatCurrency(booking.fee)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border-color)] pt-3 text-base font-bold">
            <span>Total amount</span>
            <span>{formatCurrency(booking.total)}</span>
          </div>
        </div>
      </section>

      {booking.status === "requested" && (
        <section className="panel">
          <p className="font-semibold">Waiting for owner approval</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            You can pay after the car owner approves your request.
          </p>
          <button onClick={cancelBooking} className="btn-danger mt-4">
            Cancel request
          </button>
        </section>
      )}

      {booking.status === "confirmed" && !isPaid && (
        <section className="panel">
          <h2 className="font-bold">Your request has been approved</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Complete payment to confirm your rental.
          </p>
          <Link
            href={`/bookings/${booking.id}/payment`}
            className="btn-primary mt-4 inline-flex"
          >
            Continue to payment · {formatCurrency(booking.total)}
          </Link>
        </section>
      )}

      {isPaid && (
        <section className="panel space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">Payment confirmation</h2>
            <StatusBadge status="approved" />
          </div>
          <p className="text-sm">
            Payment received: {formatDate(booking.paidAt)}
          </p>
          <p className="text-sm">
            Payment method:{" "}
            <span className="capitalize">
              {booking.paymentMethod || "Payment"}
            </span>
          </p>
          <p className="text-sm">
            Transaction reference: <strong>{booking.transactionRef}</strong>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Payment confirmation is generated by the checkout simulation.
            No funds are transferred.
          </p>
        </section>
      )}

      {booking.status === "in_progress" && (
        <section className="panel">
          <h2 className="font-bold">Your rental is in progress</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            The owner has handed over the vehicle. The review form will be
            available after the return is confirmed.
          </p>
        </section>
      )}

      {booking.status === "completed" && !reviewExists && (
        <section className="panel">
          <h2 className="font-bold">How was your trip?</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Your rental is complete. Share your experience with the car owner.
          </p>
          <Link
            href={`/bookings/${booking.id}/review`}
            className="btn-primary mt-4 inline-flex"
          >
            Leave a review
          </Link>
        </section>
      )}

      {reviewExists && (
        <section className="panel">
          <p className="font-semibold">
            Thank you for reviewing your trip.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Your review has been shared with the car owner.
          </p>
        </section>
      )}

      {isPaid && (
        <div className="text-center">
          <p className="text-sm font-semibold">Payment receipt</p>
          <p className="text-xs text-[var(--text-muted)]">
            A receipt is available because this booking has been paid.
          </p>
        </div>
      )}

      <div>
        <Link
          href="/renter/dashboard"
          className="text-sm font-semibold underline"
        >
          ← Back to renter dashboard
        </Link>
      </div>
    </main>
  );
}