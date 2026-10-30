'use client';
import { Suspense, use, useEffect, useState } from "react";
import { getCurrentSession } from '@/lib/auth';
import { getCarById, saveCar } from '@/lib/cars';

export default function EditCarPage({ params }) {
  return (
    <Suspense fallback={<main>Loading car editor...</main>}>
      <EditCarContent params={params} />
    </Suspense>
  );
}

function EditCarContent({ params }) {
  const { id } = use (params);
  const [car, setCar] = useState(null);
  const [price, setPrice] = useState('');

  useEffect(() => {
    const user = getCurrentSession();
    if (!user) { window.location.href = '/signin'; return; }
    const found = getCarById(id);
    if (found) { setCar(found); setPrice(found.pricePerDay); }
  }, [id]);

  if (!car) return <div className="container" style={{ padding: '4rem' }}>Loading car...</div>;

  const handleUpdate = (e) => {
    e.preventDefault();
    const user = getCurrentSession();
    saveCar({ ...car, pricePerDay: Number(price) }, user.id);
    window.location.href = '/owner/cars';
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
      <h1>Edit Listing: {car.make} {car.model}</h1>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '0.35rem' }}>PRICE PER DAY (ETB)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
        </div>
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
}