'use client';
import { useEffect, useState } from 'react';
import { getCarById } from '@/lib/cars';

export default function AvailabilityPage({ params }) {
  const { id } = params;
  const [car, setCar] = useState(null);

  useEffect(() => {
    setCar(getCarById(id));
  }, [id]);

  if (!car) return <div className="container" style={{ padding: '4rem' }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
      <h1>Manage Availability: {car.make} {car.model}</h1>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Current Unavailable Dates: None recorded.</p>
        <p style={{ fontSize: '0.85rem', color: '#888' }}>Automatic blocking is active when bookings are confirmed.</p>
      </div>
    </div>
  );
}