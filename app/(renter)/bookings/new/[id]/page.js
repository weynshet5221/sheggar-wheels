"use client";

import {Suspense, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LegacyBookingRedirect() {
  return (
    <Suspense fallback={<main>Redirecting...</main>}>
      <LegacyBookingRedirectContent />
    </Suspense>
  );
}

function LegacyBookingRedirectContent() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/cars/${id}`);
  }, [id, router]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      Opening vehicle details...
    </main>
  );
}