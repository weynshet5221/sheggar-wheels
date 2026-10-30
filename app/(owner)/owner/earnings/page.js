'use client';

import { useEffect, useState } from 'react';
import { getCurrentSession } from '@/lib/auth';
import { getBookings } from '@/lib/bookings';
import { formatCurrency } from '@/lib/format';
import { exportToCSV } from '@/lib/csv';

export default function OwnerEarningsPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const activeUser = getCurrentSession();
    if (!activeUser || !activeUser.roles.includes('owner')) {
      window.location.href = '/signin';
      return;
    }
    setUser(activeUser);
    setBookings(getBookings({ ownerId: activeUser.id, status: 'completed' }));
  }, []);

  if (!user) return null;

  const totalEarnings = bookings.reduce((acc, b) => acc + (b.subtotal || 0), 0);

  const handleExport = () => {
    const rows = bookings.map((b) => ({
      BookingID: b.id,
      CarID: b.carId,
      StartDate: b.startDate,
      EndDate: b.endDate,
      EarningsETB: b.subtotal,
    }));
    exportToCSV('owner_earnings.csv', rows);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Earnings & Payouts</h1>
          <p className="text-xs text-gray-500">Summary of completed rental earnings.</p>
        </div>
        <button onClick={handleExport} className="bg-[#2d4a3e] text-white text-xs font-bold px-4 py-2.5 rounded-xl">
          📥 Export Earnings (CSV)
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border">
        <span className="text-xs text-gray-500">TOTAL COMPLETED REVENUE</span>
        <p className="text-4xl font-extrabold text-[#2d4a3e] mt-1">{formatCurrency(totalEarnings)}</p>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold text-lg mb-4">Completed Rentals Breakdown</h2>
        {bookings.length === 0 ? (
          <p className="text-xs text-gray-500">No completed earnings records yet.</p>
        ) : (
          <div className="divide-y">
            {bookings.map((b) => (
              <div key={b.id} className="py-4 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold">Booking #{b.id}</p>
                  <p className="text-xs text-gray-500">{b.startDate} to {b.endDate}</p>
                </div>
                <span className="font-bold text-[#2d4a3e]">{formatCurrency(b.subtotal)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}