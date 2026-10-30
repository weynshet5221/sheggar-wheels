"use client";

import { Suspense, useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCarById } from "@/lib/cars";
import { createBooking } from "@/lib/bookings";
import { formatCurrency } from "@/lib/format";
import { getCurrentSession } from "@/lib/auth";

const FALLBACK_IMAGE = "/images/cars/sedan.svg";

function getSafeImage(src) {
  if (
    typeof src === "string" &&
    (src.startsWith("/") || src.startsWith("data:image/"))
  ) {
    return src;
  }

  if (typeof src === "string" && src.startsWith("https://")) {
    return src;
  }

  return FALLBACK_IMAGE;
}

function getToday() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
}
export default function CarDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p>Loading vehicle details...</p>
        </main>
      }
    >
      <CarDetailContent params={params} />
    </Suspense>
  );
}

function CarDetailContent({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const foundCar = getCarById(id);

    setCar(foundCar);
    setSelectedPhoto(getSafeImage(foundCar?.photos?.[0]));
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-gray-600">Loading vehicle details...</p>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#172d22]">
          Vehicle not found
        </h1>
        <p className="mt-2 text-gray-600">
          This vehicle may have been removed or its listing may be unavailable.
        </p>
        <Link
          href="/cars"
          className="mt-5 inline-block font-semibold text-[#2d4a3e] underline"
        >
          Browse available cars
        </Link>
      </main>
    );
  }

  if (car.status !== "approved") {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#172d22]">
          This listing is not available
        </h1>
        <p className="mt-2 text-gray-600">
          Only approved listings can be viewed and booked publicly.
        </p>
        <Link
          href="/cars"
          className="mt-5 inline-block font-semibold text-[#2d4a3e] underline"
        >
          Back to available cars
        </Link>
      </main>
    );
  }

  const photos =
    Array.isArray(car.photos) && car.photos.length
      ? car.photos.map(getSafeImage)
      : [FALLBACK_IMAGE];

  const today = getToday();

  const days =
    startDate && endDate
      ? Math.round(
          (Date.parse(`${endDate}T00:00:00Z`) -
            Date.parse(`${startDate}T00:00:00Z`)) /
            86400000
        )
      : 0;

  const subtotal = days > 0 ? days * Number(car.pricePerDay) : 0;
  const fee = Math.round(subtotal * 0.1);
  const total = subtotal + fee;

  function handleBookingRequest(event) {
    event.preventDefault();
    setError("");

    const user = getCurrentSession();

    if (!user) {
      router.push(
        `/signin?next=${encodeURIComponent(`/cars/${car.id}`)}`
      );
      return;
    }

    if (user.activeRole !== "renter") {
      setError("Switch to the renter role to request a booking.");
      return;
    }

    if (user.id === car.ownerId) {
      setError("You cannot book your own vehicle.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Choose both a pickup date and a return date.");
      return;
    }

    if (startDate < today) {
      setError("The pickup date cannot be in the past.");
      return;
    }

    if (endDate <= startDate || days < 1) {
      setError("The return date must be after the pickup date.");
      return;
    }

    try {
      setIsSubmitting(true);
const booking = createBooking(
  {
    carId: car.id,
    ownerId: car.ownerId,
    startDate,
    endDate,
  },
  user.id
);

      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      setError(err.message || "Unable to submit your booking request.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
      <section className="space-y-6">
        <div className="relative h-72 overflow-hidden rounded-2xl bg-gray-100 sm:h-[430px]">
          <Image
            src={getSafeImage(selectedPhoto || FALLBACK_IMAGE)}
            alt={`${car.make} ${car.model}`}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 65vw"
            className="object-cover"
          />
        </div>

        {photos.length > 1 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((photo, index) => (
              <button
                key={`${photo}-${index}`}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                aria-label={`Show vehicle photo ${index + 1}`}
                aria-pressed={selectedPhoto === photo}
                className={`relative h-20 overflow-hidden rounded-xl border-2 ${
                  selectedPhoto === photo
                    ? "border-[#172d22]"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={photo}
                  alt={`${car.make} ${car.model}, photo ${index + 1}`}
                  fill
                  unoptimized
                  sizes="160px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#55715e]">
            Vehicle details · Demo listing
          </p>

          <h1 className="text-3xl font-bold text-[#172d22]">
            {car.make} {car.model} ({car.year})
          </h1>

          <p className="mt-2 text-gray-600">
            {car.city || "Addis Ababa"} ·{" "}
            {car.neighbourhood || "Location not listed"}
          </p>
        </div>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">
            Vehicle specifications
          </h2>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Transmission</dt>
              <dd className="font-semibold">
                {car.transmission || "Not listed"}
              </dd>
            </div>

            <div>
              <dt className="text-gray-500">Seats</dt>
              <dd className="font-semibold">
                {car.seats || "Not listed"}
              </dd>
            </div>

            <div>
              <dt className="text-gray-500">Year</dt>
              <dd className="font-semibold">
                {car.year || "Not listed"}
              </dd>
            </div>

            <div>
              <dt className="text-gray-500">Availability</dt>
              <dd className="font-semibold">Listing approved</dd>
            </div>
          </dl>

          <p className="mt-5 border-t pt-4 text-sm leading-6 text-gray-600">
            {car.description || "No description provided."}
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-2 text-lg font-bold">Location</h2>

          <p className="text-sm text-gray-600">
            {car.neighbourhood || "Addis Ababa"},{" "}
            {car.city || "Addis Ababa"}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Location is seeded demo information, not live GPS tracking.
          </p>
        </section>
      </section>

      <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm md:sticky md:top-6">
        <p className="text-2xl font-extrabold text-[#172d22]">
          {formatCurrency(car.pricePerDay)}
          <span className="text-sm font-normal text-gray-500">
            {" "}/ day
          </span>
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Payment is available after owner approval.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleBookingRequest} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="start-date"
              className="mb-1 block text-sm font-semibold"
            >
              Pickup date
            </label>

            <input
              id="start-date"
              type="date"
              min={today}
              required
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);

                if (endDate && event.target.value >= endDate) {
                  setEndDate("");
                }
              }}
              className="min-h-11 w-full rounded-lg border p-3 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="end-date"
              className="mb-1 block text-sm font-semibold"
            >
              Return date
            </label>

            <input
              id="end-date"
              type="date"
              min={startDate || today}
              required
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="min-h-11 w-full rounded-lg border p-3 text-sm"
            />
          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span>Rental days</span>
              <span>{days > 0 ? days : "Choose dates"}</span>
            </div>

            <div className="mt-2 flex justify-between gap-4">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="mt-2 flex justify-between gap-4">
              <span>Platform fee (10%)</span>
              <span>{formatCurrency(fee)}</span>
            </div>

            <div className="mt-3 flex justify-between gap-4 border-t pt-3 font-bold">
              <span>Estimated total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-12 w-full rounded-xl bg-[#172d22] px-4 py-3 font-bold text-white hover:bg-[#294a37] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending request..." : "Request Booking"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          You will not be charged now. Payment comes after owner approval.
        </p>
      </aside>
    </main>
  );
}