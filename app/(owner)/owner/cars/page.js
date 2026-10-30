"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getCars } from "@/lib/cars";
import { formatCurrency } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export default function OwnerCarsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);

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
    setCars(getCars({ ownerId: active.id }));
  }, [router]);

  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        Loading listings...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Owner workspace</p>
          <h1 className="text-3xl font-bold">Manage listings</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Update your vehicles, pricing and availability.
          </p>
        </div>

        <Link href="/owner/cars/new" className="btn-primary">
          + Add new car
        </Link>
      </div>

      {cars.length === 0 ? (
        <section className="panel text-sm text-[var(--text-muted)]">
          You have not listed any vehicles yet.
        </section>
      ) : (
        <div className="space-y-3">
          {cars.map((car) => (
            <article
              key={car.id}
              className="panel flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <img
                src={car.photos?.[0] || "/images/cars/sedan.jpg"}
                alt={`${car.make} ${car.model}`}
                className="h-24 w-full rounded-xl object-cover sm:w-36"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold">
                    {car.make} {car.model} ({car.year})
                  </h2>
                  <StatusBadge status={car.status} />
                </div>

                <p className="text-sm text-[var(--text-muted)]">
                  {car.neighbourhood} · {car.transmission} · {car.seats} seats
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formatCurrency(car.pricePerDay)} / day
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/owner/cars/${car.id}`}
                  className="btn-secondary"
                >
                  View details
                </Link>

                <Link
                  href={`/owner/cars/${car.id}/edit`}
                  className="btn-primary"
                >
                  Edit
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}