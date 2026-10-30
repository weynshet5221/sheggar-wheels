'use client';
import { NEIGHBOURHOODS } from '@/lib/constants';

export default function CarFilters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '0.35rem' }}>NEIGHBOURHOOD</label>
        <select value={filters.neighbourhood || ''} onChange={(e) => handleChange('neighbourhood', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <option value="">All Locations</option>
          {NEIGHBOURHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '0.35rem' }}>TRANSMISSION</label>
        <select value={filters.transmission || ''} onChange={(e) => handleChange('transmission', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <option value="">Any Transmission</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '0.35rem' }}>MAX DAILY PRICE (ETB)</label>
        <input type="number" placeholder="e.g. 5000" value={filters.maxPrice || ''} onChange={(e) => handleChange('maxPrice', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
      </div>
    </div>
  );
}