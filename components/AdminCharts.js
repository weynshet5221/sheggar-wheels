"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = [
  "#193d2b",
  "#b9674b",
  "#8ba58d",
  "#d8b79c",
  "#758a78",
  "#9d6b50"
];

export default function AdminCharts({
  users = [],
  cars = [],
  bookings = []
}) {
  const bookingStatuses = useMemo(() => {
    const counts = {};

    bookings.forEach((booking) => {
      const status = booking.status || "unknown";
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name.replaceAll("_", " "),
      value
    }));
  }, [bookings]);

  return (
    <div className="stack">
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

      <section className="chart-panel">
        <h3>Booking status breakdown</h3>

        {bookingStatuses.length === 0 ? (
          <p className="muted">
            No booking data is available yet.
          </p>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatuses}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="48%"
                  outerRadius={85}
                  label
                >
                  {bookingStatuses.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}