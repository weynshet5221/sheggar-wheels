'use client';
import { useState } from 'react';

export default function BookingForm({ pricePerDay, onSubmit }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) return alert('End date must be after start date.');
    const subtotal = days * pricePerDay;
    const fee = Math.round(subtotal * 0.1);
    onSubmit({ startDate, endDate, days, subtotal, fee, total: subtotal + fee });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '0.35rem' }}>START DATE</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
      </div>
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '0.35rem' }}>END DATE</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
      </div>
      <button type="submit" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>Reserve Vehicle</button>
    </form>
  );
}