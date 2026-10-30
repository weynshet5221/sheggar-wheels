'use client';
import { useEffect, useState } from 'react';
import { getBookings } from '@/lib/bookings';
import { getCarById } from '@/lib/cars';

export default function CarBookingsPage({ params }) {
  const { id } = params;
  const [bookings, setBookings] = useState([]);
  const [car, setCar] = useState(null);

  useEffect(() => {
    setBookings(getBookings({ carId: id }));
    setCar(getCarById(id));
  }, [id]);

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <h1>Bookings for {car?.make} {car?.model}</h1>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
        {bookings.length === 0 ? <p>No bookings for this specific car.</p> : bookings.map(b => <div key={b.id}>Booking #{b.id} ({b.status})</div>)}
      </div>
    </div>
  );
}