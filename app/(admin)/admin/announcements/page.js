'use client';
import { useState } from 'react';
import { getCurrentSession } from '@/lib/auth';
import { createAnnouncement } from '@/lib/announcements';

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    const user = getCurrentSession();
    createAnnouncement({ title, message }, user.id);
    alert('Announcement published successfully.');
    setTitle(''); setMessage('');
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
      <h1>Create Platform Announcement</h1>
      <form onSubmit={handlePost} style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '0.35rem' }}>TITLE</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '0.35rem' }}>MESSAGE</label>
          <textarea rows="3" value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
        </div>
        <button type="submit" className="btn-primary">Publish Announcement</button>
      </form>
    </div>
  );
}