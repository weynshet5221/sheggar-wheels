'use client';

import { useEffect, useState } from 'react';
import { getCurrentSession } from '@/lib/auth';
import { getCars, updateCarStatus } from '@/lib/cars';
import { readStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import StatusBadge from '@/components/StatusBadge';

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null);
  const [pendingCars, setPendingCars] = useState([]);

  useEffect(() => {
    const activeUser = getCurrentSession();
    if (!activeUser || !activeUser.roles.includes('admin')) {
      window.location.href = '/signin';
      return;
    }
    setUser(activeUser);
    setPendingCars(getCars({ status: 'pending' }));
  }, []);

  if (!user) return null;

  const handleApprove = (carId) => {
    updateCarStatus(carId, 'approved');
    setPendingCars(getCars({ status: 'pending' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Admin Management</h1>

      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold text-lg mb-4">Pending Vehicle Approvals</h2>
        {pendingCars.length === 0 ? (
          <p className="text-xs text-gray-500">No cars waiting for moderation.</p>
        ) : (
          <div className="divide-y">
            {pendingCars.map((car) => (
              <div key={car.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{car.make} {car.model}</p>
                  <p className="text-xs text-gray-500">{car.neighbourhood} • Owner ID: {car.ownerId}</p>
                </div>
                <button
                  onClick={() => handleApprove(car.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Approve Listing
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}