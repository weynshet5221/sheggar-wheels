"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function getMonthlyRevenue(bookings = []) {
  const now = new Date();
  const months = [];

  for (let offset = 5; offset >= 0; offset--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - offset,
      1
    );

    const key =
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

    months.push({
      key,
      month: date.toLocaleDateString("en", { month: "short" }),
      revenue: 0
    });
  }

  const monthMap = new Map(
    months.map((month) => [month.key, month])
  );

  bookings.forEach((booking) => {
    const status = String(booking.status || "").toLowerCase();

    if (["cancelled", "declined", "rejected"].includes(status)) {
      return;
    }

    const date = new Date(
      booking.createdAt || booking.startDate || Date.now()
    );

    const key =
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

    const month = monthMap.get(key);

    if (month) {
      month.revenue += Number(
        booking.subtotal || booking.total || 0
      );
    }
  });

  return months;
}

export default function OwnerCharts({ bookings = [] }) {
  const monthlyData = useMemo(
    () => getMonthlyRevenue(bookings),
    [bookings]
  );

  const totalRevenue = monthlyData.reduce(
    (sum, month) => sum + month.revenue,
    0
  );

  return (
    <section className="chart-panel">
      <h3>Earnings overview</h3>

      <p className="muted">
        Recorded booking revenue for the last six months.
      </p>

      <strong className="price">
        ETB {totalRevenue.toLocaleString()}
      </strong>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e6ded1"
            />

            <XAxis dataKey="month" axisLine={false} tickLine={false} />

            <YAxis axisLine={false} tickLine={false} width={60} />

            <Tooltip
              formatter={(value) => [
                `ETB ${Number(value).toLocaleString()}`,
                "Revenue"
              ]}
            />

            <Bar
              dataKey="revenue"
              fill="#193d2b"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function AdminCharts({
  users = [],
  cars = [],
  bookings = []
}) {
  return (
    <div className="stat-grid">
      <article className="stat-card">
        <span className="muted">Total users</span>
        <p>{users.length}</p>
      </article>

      <article className="stat-card">
        <span className="muted">Total vehicles</span>
        <p>{cars.length}</p>
      </article>

      <article className="stat-card">
        <span className="muted">Total bookings</span>
        <p>{bookings.length}</p>
      </article>
    </div>
  );
}