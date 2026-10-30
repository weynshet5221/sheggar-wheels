'use client';
import { useEffect, useState } from 'react';
import { readStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

export default function AdminUserDetailPage({ params }) {
  const { id } = params;
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    const users = readStorage(STORAGE_KEYS.USERS, []);
    setTargetUser(users.find(u => u.id === id));
  }, [id]);

  if (!targetUser) return <div className="container" style={{ padding: '4rem' }}>User not found</div>;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
      <h1>User Detail: {targetUser.name}</h1>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p><strong>Email:</strong> {targetUser.email}</p>
        <p><strong>Phone:</strong> {targetUser.phone}</p>
        <p><strong>Roles:</strong> {targetUser.roles.join(', ')}</p>
        <p><strong>Status:</strong> {targetUser.status}</p>
      </div>
    </div>
  );
}