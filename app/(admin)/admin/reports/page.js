
"use client";

import { useEffect, useState } from "react";
import { readStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import AdminCharts from "@/components/AdminCharts";

export default function AdminReportsPage() {
  const [data, setData] = useState({
    users: [],
    cars: [],
    bookings: [],
  });

  useEffect(() => {
    setData({
      users: readStorage(STORAGE_KEYS.USERS, []),
      cars: readStorage(STORAGE_KEYS.CARS, []),
      bookings: readStorage(STORAGE_KEYS.BOOKINGS, []),
    });
  }, []);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold text-[#193d2b]">
          Platform Reports & Analytics
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of users, vehicles, and booking activity.
        </p>
      </header>

      <AdminCharts
        users={data.users}
        cars={data.cars}
        bookings={data.bookings}
      />
    </main>
  );
}
