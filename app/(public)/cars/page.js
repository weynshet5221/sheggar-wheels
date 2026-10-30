"use client";

import { useEffect, useMemo, useState } from "react";
import CarGrid from "@/components/CarGrid";
import { getCars } from "@/lib/cars";
import { initializeDemoData } from "@/lib/storage";
import { NEIGHBOURHOODS } from "@/lib/constants";

const PAGE_SIZE = 9;

export default function CarsCataloguePage() {
  const [allCars, setAllCars] = useState([]);
  const [search, setSearch] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [transmission, setTransmission] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSeats, setMinSeats] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    initializeDemoData();
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") || "");
    setNeighbourhood(params.get("neighbourhood") || "");
    setTransmission(params.get("transmission") || "");
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
    setMinSeats(params.get("seats") || "");
    setSort(params.get("sort") || "newest");
    setAllCars(getCars({ status: "approved" }));
  }, []);

  const filteredCars = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = allCars.filter((car) => {
      const searchable = `${car.make} ${car.model} ${car.description || ""}`.toLowerCase();
      if (query && !searchable.includes(query)) return false;
      if (neighbourhood && car.neighbourhood !== neighbourhood) return false;
      if (transmission && car.transmission !== transmission) return false;
      if (minPrice !== "" && Number(car.pricePerDay) < Number(minPrice)) return false;
      if (maxPrice !== "" && Number(car.pricePerDay) > Number(maxPrice)) return false;
      if (minSeats !== "" && Number(car.seats) < Number(minSeats)) return false;
      return car.status === "approved";
    });

    result.sort((a, b) => {
      if (sort === "price-asc") return Number(a.pricePerDay) - Number(b.pricePerDay);
      if (sort === "price-desc") return Number(b.pricePerDay) - Number(a.pricePerDay);
      if (sort === "newest") return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      if (sort === "popular") return Number(b.views || 0) - Number(a.views || 0);
      return 0;
    });
    return result;
  }, [allCars, search, neighbourhood, transmission, minPrice, maxPrice, minSeats, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, neighbourhood, transmission, minPrice, maxPrice, minSeats, sort]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (neighbourhood) params.set("neighbourhood", neighbourhood);
    if (transmission) params.set("transmission", transmission);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minSeats) params.set("seats", minSeats);
    if (sort !== "newest") params.set("sort", sort);
    const query = params.toString();
    const nextUrl = query ? `/cars?${query}` : "/cars";
    window.history.replaceState(null, "", nextUrl);
  }, [search, neighbourhood, transmission, minPrice, maxPrice, minSeats, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredCars.length / PAGE_SIZE));
  const visibleCars = filteredCars.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setSearch("");
    setNeighbourhood("");
    setTransmission("");
    setMinPrice("");
    setMaxPrice("");
    setMinSeats("");
    setSort("newest");
    setPage(1);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[#172d22]">Available Cars in Addis Ababa</h1>
      </div>

      <section aria-label="Car filters" className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-[#e2e8e4] bg-white p-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="car-search" className="mb-1 block text-xs font-semibold text-gray-600">SEARCH</label>
          <input id="car-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Make, model, description" className="w-full rounded-lg border bg-gray-50 p-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="neighbourhood" className="mb-1 block text-xs font-semibold text-gray-600">NEIGHBOURHOOD</label>
          <select id="neighbourhood" value={neighbourhood} onChange={(event) => setNeighbourhood(event.target.value)} className="w-full rounded-lg border bg-gray-50 p-2.5 text-sm">
            <option value="">All locations</option>
            {NEIGHBOURHOODS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="transmission" className="mb-1 block text-xs font-semibold text-gray-600">TRANSMISSION</label>
          <select id="transmission" value={transmission} onChange={(event) => setTransmission(event.target.value)} className="w-full rounded-lg border bg-gray-50 p-2.5 text-sm">
            <option value="">Any transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="mb-1 block text-xs font-semibold text-gray-600">SORT BY</label>
          <select id="sort" value={sort} onChange={(event) => setSort(event.target.value)} className="w-full rounded-lg border bg-gray-50 p-2.5 text-sm">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="popular">Popularity (demo)</option>
          </select>
        </div>
        <div>
          <label htmlFor="min-price" className="mb-1 block text-xs font-semibold text-gray-600">MIN PRICE (ETB/DAY)</label>
          <input id="min-price" type="number" min="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="No minimum" className="w-full rounded-lg border bg-gray-50 p-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="max-price" className="mb-1 block text-xs font-semibold text-gray-600">MAX PRICE (ETB/DAY)</label>
          <input id="max-price" type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="No maximum" className="w-full rounded-lg border bg-gray-50 p-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="min-seats" className="mb-1 block text-xs font-semibold text-gray-600">MINIMUM SEATS</label>
          <select id="min-seats" value={minSeats} onChange={(event) => setMinSeats(event.target.value)} className="w-full rounded-lg border bg-gray-50 p-2.5 text-sm">
            <option value="">Any capacity</option>
            <option value="2">2+ seats</option>
            <option value="4">4+ seats</option>
            <option value="5">5+ seats</option>
            <option value="7">7+ seats</option>
            <option value="10">10+ seats</option>
          </select>
        </div>
        <div className="flex items-end">
          <button type="button" onClick={resetFilters} className="min-h-11 w-full rounded-lg border border-[#1a2e22] px-4 py-2 text-sm font-semibold text-[#1a2e22] hover:bg-gray-50">Reset filters</button>
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600" aria-live="polite">{filteredCars.length} {filteredCars.length === 1 ? "vehicle" : "vehicles"} found</p>
        {filteredCars.length > 0 && <p className="text-xs text-gray-500">Page {page} of {pageCount}</p>}
      </div>

      <CarGrid cars={visibleCars} />

      {pageCount > 1 && (
        <nav aria-label="Catalogue pages" className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="min-h-11 rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button key={pageNumber} type="button" aria-current={page === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={`min-h-11 min-w-11 rounded-lg border px-3 py-2 text-sm ${page === pageNumber ? "border-[#172d22] bg-[#172d22] text-white" : "bg-white text-gray-700"}`}>{pageNumber}</button>
          ))}
          <button type="button" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="min-h-11 rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </nav>
      )}
    </main>
  );
}
