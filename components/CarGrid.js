import CarCard from "./CarCard";

export default function CarGrid({ cars = [] }) {
  if (cars.length === 0) {
    return (
      <div className="empty-state" role="status">
        <h3>No vehicles found</h3>
        <p>
          No vehicles match your current search. Try a different
          neighbourhood or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="car-grid">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}