'use client';

import { useEffect, useState } from 'react';
import { getCurrentSession } from '@/lib/auth';
import { getBookings } from '@/lib/bookings';
import { formatCurrency, formatDate } from '@/lib/format';
import StatusBadge from '@/components/StatusBadge';

export default function AdminBookingsPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const activeUser = getCurrentSession();
    if (!activeUser || !activeUser.roles.includes('admin')) {
      window.location.href = '/signin';
      return;
    }
    setUser(activeUser);
    setBookings(getBookings());
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">All Platform Bookings</h1>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="divide-y">
          {bookings.map((b) => (
            <div key={b.id} className="p-6 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">Booking #{b.id} (Car: {b.carId})</p>
                <p className="text-xs text-gray-500">Renter: {b.renterId} • {formatDate(b.startDate)}</p>
                <p className="text-sm font-semibold text-[#2d4a3e] mt-1">{formatCurrency(b.total)}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}