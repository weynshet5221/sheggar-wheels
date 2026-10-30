"use client";

import { Suspense,use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import {
  getBookings,
  completeBookingPayment,
} from "@/lib/bookings";
import { getCarById } from "@/lib/cars";
import { formatCurrency, formatDate } from "@/lib/format";

export default function PaymentPage({ params }) {
  return (
    <Suspense fallback={<main>Loading payment...</main>}>
      <PaymentContent params={params} />
    </Suspense>
  );
}

function PaymentContent({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [car, setCar] = useState(null);
  const [method, setMethod] = useState("telebirr");
  const [phone, setPhone] = useState("");
  const [accountName, setAccountName] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const active = getCurrentSession();

    if (!active) {
      router.replace(`/signin?next=/bookings/${id}/payment`);
      return;
    }

    setUser(active);

    const found = getBookings({ renterId: active.id }).find(
      (item) => String(item.id) === String(id)
    );

    if (!found) return;

    setBooking(found);
    setCar(getCarById(found.carId));
  }, [id, router]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (accountName.trim().length < 2) {
      setError("Enter the account holder name.");
      return;
    }

    if (method === "telebirr") {
      if (!/^((\+251|0)9\d{8})$/.test(phone.replace(/\s/g, ""))) {
        setError("Enter a valid Ethiopian mobile number, for example 0912345678.");
        return;
      }

      if (!/^\d{6}$/.test(confirmationCode)) {
        setError("Enter the 6-digit payment confirmation code.");
        return;
      }
    } else {
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Enter a 16-digit test card number.");
        return;
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        setError("Enter card expiry in MM/YY format.");
        return;
      }

      if (!/^\d{3,4}$/.test(cardCvv)) {
        setError("Enter a 3 or 4 digit security code.");
        return;
      }
    }

    try {
      setSubmitting(true);
      completeBookingPayment(booking.id, method, user.id);
      router.replace(`/bookings/${booking.id}`);
    } catch (paymentError) {
      setError(paymentError.message || "Payment could not be completed.");
      setSubmitting(false);
    }
  }

  if (!user || !booking) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        Loading checkout...
      </main>
    );
  }

  if (booking.status !== "confirmed") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">Payment unavailable</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Payment becomes available after the owner approves your booking.
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

  if (booking.paymentStatus === "paid") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">Payment already completed</h1>
        <Link
          href={`/bookings/${booking.id}`}
          className="btn-primary mt-5 inline-flex"
        >
          View booking confirmation
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.15fr_.85fr]">
      <section className="panel space-y-6">
        <div>
          <p className="eyebrow">Sheggar Wheels checkout</p>
          <h1 className="text-2xl font-bold">Complete your payment</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Your booking has been approved. Choose a payment method.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setMethod("telebirr")}
            className={`flex-1 rounded-xl border p-4 text-left ${
              method === "telebirr"
                ? "border-[var(--primary)] bg-[var(--surface-soft)]"
                : "border-[var(--border-color)]"
            }`}
          >
            <span className="block font-bold">TeleBirr</span>
            <span className="text-xs text-[var(--text-muted)]">
              Mobile wallet
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("card")}
            className={`flex-1 rounded-xl border p-4 text-left ${
              method === "card"
                ? "border-[var(--primary)] bg-[var(--surface-soft)]"
                : "border-[var(--border-color)]"
            }`}
          >
            <span className="block font-bold">Bank card</span>
            <span className="text-xs text-[var(--text-muted)]">
              Card checkout
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Account holder name
            </label>
            <input
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              autoComplete="name"
              required
              placeholder="Full name"
              className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3"
            />
          </div>

          {method === "telebirr" ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  TeleBirr mobile number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder="0912345678"
                  className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Payment confirmation code
                </label>
                <input
                  value={confirmationCode}
                  onChange={(e) =>
                    setConfirmationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  inputMode="numeric"
                  required
                  placeholder="6-digit code"
                  maxLength={6}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3 tracking-[0.3em]"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Card number
                </label>
                <input
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 16)
                    )
                  }
                  inputMode="numeric"
                  autoComplete="cc-number"
                  required
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Expiry (MM/YY)
                  </label>
                  <input
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                    autoComplete="cc-exp"
                    required
                    placeholder="MM/YY"
                    className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Security code
                  </label>
                  <input
                    value={cardCvv}
                    onChange={(e) =>
                      setCardCvv(
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    required
                    placeholder="CVV"
                    className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3"
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            disabled={submitting}
            className="btn-primary w-full py-3 disabled:opacity-60"
          >
            {submitting
              ? "Processing payment..."
              : `Pay ${formatCurrency(booking.total)}`}
          </button>

          <p className="text-center text-xs text-[var(--text-muted)]">
            This checkout is simulated. Use test information only. No real
            financial transaction takes place.
          </p>
        </form>
      </section>

      <aside className="panel h-fit space-y-4">
        <h2 className="text-lg font-bold">Order summary</h2>

        <div className="flex gap-3">
          <img
            src={car?.photos?.[0] || "/images/cars/sedan.jpg"}
            alt="Rental vehicle"
            className="h-20 w-28 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold">
              {car ? `${car.make} ${car.model}` : "Rental vehicle"}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {car?.neighbourhood || "Addis Ababa"}
            </p>
          </div>
        </div>

        <div className="space-y-2 border-t border-[var(--border-color)] pt-4 text-sm">
          <div className="flex justify-between">
            <span>Pickup</span>
            <span>{formatDate(booking.startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Return</span>
            <span>{formatDate(booking.endDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>{booking.days} rental days</span>
            <span>{formatCurrency(booking.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>{formatCurrency(booking.fee)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border-color)] pt-3 text-base font-bold">
            <span>Total due</span>
            <span>{formatCurrency(booking.total)}</span>
          </div>
        </div>

        <Link
          href={`/bookings/${booking.id}`}
          className="block text-center text-sm font-semibold underline"
        >
          Back to booking details
        </Link>
      </aside>
    </main>
  );
}