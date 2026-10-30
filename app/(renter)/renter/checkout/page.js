"use client";

import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-16">
      <p className="eyebrow">Booking process</p>

      <h1 className="text-2xl font-bold">
        Payment follows owner approval
      </h1>

      <p className="text-sm text-[var(--text-muted)]">
        First submit a rental request from a vehicle page. When the owner
        approves it, open your booking details to complete payment.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link href="/cars" className="btn-primary">
          Browse vehicles
        </Link>

        <Link href="/renter/dashboard" className="btn-secondary">
          My bookings
        </Link>
      </div>
    </main>
  );
}