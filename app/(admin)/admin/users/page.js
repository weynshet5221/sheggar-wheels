'use client';

import { useEffect, useState } from 'react';
import { getCurrentSession } from '@/lib/auth';
import { readStorage, writeStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { formatDate } from '@/lib/format';

export default function AdminUsersPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const activeUser = getCurrentSession();
    if (!activeUser || !activeUser.roles.includes('admin')) {
      window.location.href = '/signin';
      return;
    }
    setUser(activeUser);
    setUsers(readStorage(STORAGE_KEYS.USERS, []));
  }, []);

  if (!user) return null;

  const toggleSuspend = (targetId) => {
    const updated = users.map((u) => {
      if (u.id === targetId) {
        return { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' };
      }
      return u;
    });
    setUsers(updated);
    writeStorage(STORAGE_KEYS.USERS, updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Manage Demo Users</h1>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="divide-y">
          {users.map((u) => (
            <div key={u.id} className="p-6 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-[#1a2e22]">{u.name} ({u.email})</p>
                <p className="text-xs text-gray-500">Roles: {u.roles.join(', ')} • Joined: {formatDate(u.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${u.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {u.status.toUpperCase()}
                </span>
                {u.id !== user.id && (
                  <button
                    onClick={() => toggleSuspend(u.id)}
                    className="border text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    {u.status === 'suspended' ? 'Reinstate' : 'Suspend'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}