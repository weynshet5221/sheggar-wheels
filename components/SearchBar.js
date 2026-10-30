'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NEIGHBOURHOODS } from '@/lib/constants';

export default function SearchBar() {
  const router = useRouter();
  const [neighbourhood, setNeighbourhood] = useState('');
  const [seats, setSeats] = useState('');
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (neighbourhood) params.set('neighbourhood', neighbourhood);
    if (seats) params.set('seats', seats);
    if (search) params.set('search', search);

    router.push(`/cars?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <div className="search-field">
        <label>LOCATION</label>
        <select value={neighbourhood} onChange={(e) => setNeighbourhood(e.target.value)}>
          <option value="">All Neighbourhoods</option>
          {NEIGHBOURHOODS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <label>CAPACITY</label>
        <select value={seats} onChange={(e) => setSeats(e.target.value)}>
          <option value="">Any Capacity</option>
          <option value="4">4+ Seats</option>
          <option value="5">5+ Seats</option>
          <option value="7">7+ Seats</option>
        </select>
      </div>

      <div className="search-field">
        <label>MAKE / MODEL</label>
        <input
          type="text"
          placeholder="e.g. Mercedes, Toyota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <button type="submit" className="search-btn">
          Find Vehicle
        </button>
      </div>
    </form>
  );
}