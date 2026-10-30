"use client";

import { Suspense, use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getBookings } from "@/lib/bookings";
import { getCarById } from "@/lib/cars";
import { createReview, getReviews } from "@/lib/reviews";

export default function LeaveReviewPage({ params }) {
  return (
    <Suspense fallback={<main>Loading review...</main>}>
      <LeaveReviewContent params={params} />
    </Suspense>
  );
}

function LeaveReviewContent({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [car, setCar] = useState(null);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const active = getCurrentSession();

    if (!active) {
      router.replace(`/signin?next=/bookings/${id}/review`);
      return;
    }

    setUser(active);

    const found = getBookings({ renterId: active.id }).find(
      (item) => String(item.id) === String(id)
    );

    if (found) {
      setBooking(found);
      setCar(getCarById(found.carId));
    }
  }, [id, router]);

  function handleSubmit(event) {
    event.preventDefault();

    try {
      createReview(
        {
          bookingId: booking.id,
          rating: Number(rating),
          comment,
        },
        user.id
      );

      router.replace(`/bookings/${booking.id}`);
    } catch (reviewError) {
      setError(reviewError.message || "Could not submit your review.");
    }
  }

  if (!user || !booking) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        Loading review form...
      </main>
    );
  }

  if (booking.status !== "completed") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-bold">Review not available yet</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          You can leave a review after the owner confirms the car has been
          returned.
        </p>
        <Link
          href={`/bookings/${booking.id}`}
          className="btn-primary mt-5 inline-flex"
        >
          Back to booking
        </Link>
      </main>
    );
  }

  if (getReviews({ bookingId: booking.id }).length) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-bold">Review already submitted</h1>
        <Link
          href={`/bookings/${booking.id}`}
          className="btn-primary mt-5 inline-flex"
        >
          Back to booking
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div>
        <p className="eyebrow">Completed rental</p>
        <h1 className="text-3xl font-bold">Share your experience</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Your feedback helps other renters choose with confidence.
        </p>
      </div>

      <section className="panel flex items-center gap-4">
        <img
          src={car?.photos?.[0] || "/images/cars/sedan.jpg"}
          alt="Rented car"
          className="h-20 w-28 rounded-xl object-cover"
        />
        <div>
          <p className="font-bold">
            {car ? `${car.make} ${car.model}` : "Your rental"}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Booking #{booking.id}
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="panel space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Your rating
          </label>
          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-3"
          >
            <option value="5">★★★★★ — Excellent</option>
            <option value="4">★★★★☆ — Very good</option>
            <option value="3">★★★☆☆ — Good</option>
            <option value="2">★★☆☆☆ — Needs improvement</option>
            <option value="1">★☆☆☆☆ — Poor</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Your review
          </label>
          <textarea
            rows={5}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            minLength={5}
            required
            placeholder="How was the vehicle and your rental experience?"
            className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-3"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full">
          Submit review
        </button>
      </form>
    </main>
  );
}