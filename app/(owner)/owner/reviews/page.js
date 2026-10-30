"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getReviews, replyToReview } from "@/lib/reviews";
import { getCarById } from "@/lib/cars";
import { formatDate } from "@/lib/format";

export default function OwnerReviewsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [error, setError] = useState("");

  function refresh(ownerId) {
    setReviews(getReviews({ ownerId }));
  }

  useEffect(() => {
    const active = getCurrentSession();

    if (!active) {
      router.replace("/signin");
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
    refresh(active.id);
  }, [router]);

  function handleReply(reviewId) {
    try {
      setError("");
      replyToReview(reviewId, replyText[reviewId], user.id);

      setReplyText((current) => ({
        ...current,
        [reviewId]: "",
      }));

      refresh(user.id);
    } catch (err) {
      setError(err.message || "Could not submit reply.");
    }
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        Loading reviews...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div>
        <Link
          href="/owner/dashboard"
          className="text-sm font-semibold "
        >
          ← Owner dashboard
        </Link>

        <p className="eyebrow mt-5">Customer feedback</p>
        <h1 className="text-3xl font-bold">Customer reviews</h1>
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {reviews.length === 0 ? (
        <section className="panel text-sm text-[var(--text-muted)]">
          No reviews received yet. Reviews will appear here after renters
          complete their trips.
        </section>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const car = getCarById(review.carId);
            return (
              <article key={review.id} className="panel space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={car?.photos?.[0] || "/images/cars/sedan.jpg"}
                    alt="Reviewed vehicle"
                    className="h-16 w-24 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold">
                      {car
                        ? `${car.make} ${car.model}`
                        : "Vehicle review"}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatDate(review.createdAt)} · Booking #{review.bookingId}
                    </p>
                  </div>

                  <span className="font-bold text-amber-600">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="text-sm leading-6">{review.comment}</p>

                {review.ownerReply ? (
                  <div className="rounded-xl bg-[var(--surface-muted)] p-3">
                    <p className="text-xs font-bold">Your reply</p>
                    <p className="mt-1 text-sm">{review.ownerReply}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Reply to this review
                    </label>

                    <textarea
                      rows={3}
                      value={replyText[review.id] || ""}
                      onChange={(event) =>
                        setReplyText((current) => ({
                          ...current,
                          [review.id]: event.target.value,
                        }))
                      }
                      placeholder="Write a professional response..."
                      className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-3"
                    />

                    <button
                      onClick={() => handleReply(review.id)}
                      className="btn-primary"
                    >
                      Send reply
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}