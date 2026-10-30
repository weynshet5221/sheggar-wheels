'use client';
import { TripMap } from '@/components/TripMap';

export default function TrackTripPage() {
  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '700px' }}>
      <h1>Simulated Trip Tracking</h1>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Status: Rental Active in Addis Ababa simulation.</p>
        <TripMap />
      </div>
    </div>
  );
}