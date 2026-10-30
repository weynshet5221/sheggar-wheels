"use client";

import {  Suspense,use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getCarById } from "@/lib/cars";
import { getBookings } from "@/lib/bookings";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export default function OwnerCarDetailsPage({ params }) {
  return (
    <Suspense fallback={<main>Loading car details...</main>}>
      <OwnerCarDetailsContent params={params} />
    </Suspense>
  );
}

function OwnerCarDetailsContent({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [car, setCar] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = getCurrentSession();

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (
      user.activeRole !== "owner" &&
      !user.roles?.includes("owner")
    ) {
      router.replace("/signin");
      return;
    }

    const found = getCarById(id);

    if (!found || found.ownerId !== user.id) return;

    setCar(found);
    setBookings(getBookings({ ownerId: user.id, carId: id }));
  }, [id, router]);

  if (!car) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        Loading vehicle details...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <Link
        href="/owner/cars"
        className="text-sm font-semibold underline"
      >
        ← Back to manage listings
      </Link>

      <section className="panel grid gap-5 md:grid-cols-[240px_1fr]">
        <img
          src={car.photos?.[0] || "/images/cars/sedan.jpg"}
          alt={`${car.make} ${car.model}`}
          className="h-48 w-full rounded-xl object-cover md:h-44"
        />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-bold">
              {car.make} {car.model}
            </h1>
            <StatusBadge status={car.status} />
          </div>

          <p className="text-sm text-[var(--text-muted)]">
            {car.year} · {car.neighbourhood}, Addis Ababa ·{" "}
            {car.transmission} · {car.seats} seats
          </p>

          <p className="text-lg font-bold">
            {formatCurrency(car.pricePerDay)} / day
          </p>

          <p className="text-sm">{car.description}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href={`/owner/cars/${car.id}/edit`}
              className="btn-primary"
            >
              Edit listing
            </Link>

            <Link
              href={`/owner/cars/${car.id}/availability`}
              className="btn-secondary"
            >
              Manage availability
            </Link>
          </div>
        </div>
      </section>

      <section className="panel space-y-3">
        <h2 className="text-lg font-bold">Bookings for this vehicle</h2>

        {bookings.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            No bookings for this vehicle yet.
          </p>
        ) : (
          bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/owner/bookings/${booking.id}`}
              className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] p-3"
            >
              <img
                src={car.photos?.[0] || "/images/cars/sedan.jpg"}
                alt=""
                className="h-14 w-20 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  Booking #{booking.id}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {formatDate(booking.startDate)} –{" "}
                  {formatDate(booking.endDate)}
                </p>
              </div>

              <StatusBadge status={booking.status} />
            </Link>
          ))
        )}
      </section>
    </main>
  );
}