
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
const cars = [
  {
    id: "1",
    name: "Toyota Corolla",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    price: 1800,
    image: "/images/cars/sedan.jpg",
  },
  {
    id: "2",
    name: "Toyota RAV4",
    type: "SUV",
    transmission: "Automatic",
    seats: 5,
    price: 2500,
    image: "/images/cars/suv.jpg",
  },
  {
    id: "3",
    name: "Hyundai Accent",
    type: "Compact",
    transmission: "Manual",
    seats: 5,
    price: 1500,
    image: "/images/cars/compact.jpg",
  },
];

export default function HomePage() {
  return (
    <main className="sw-home">
      <section className="sw-hero">
        <div className="sw-hero-image">
          <Image
            src="/images/cars/home.jpg"
            alt="Car available to rent through Sheggar Wheels"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 65vw"
          />
        </div>

        <div className="sw-hero-gradient" />

        <div className="sw-hero-content">
          <p className="sw-eyebrow">YOUR JOURNEY, YOUR WAY</p>

          <h1>
            RENT THE BEST
            <br />
            CAR FROM US
          </h1>
          <Link href="/cars" className="sw-hero-button">
            Explore available cars <span aria-hidden="true">→</span>
          </Link>
        </div>
        <form action="/cars" method="GET" className="sw-search">
          <label className="sw-search-field">
            <span className="sw-field-content">
              <span className="sw-field-label">Location</span>
              <select name="location" defaultValue="Addis Ababa">
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Bole">Bole</option>
                <option value="Piazza">Piazza</option>
                <option value="Kazanchis">Kazanchis</option>
                <option value="Arada">Arada</option>
              </select>
            </span>
          </label>
          <label className="sw-search-field">
            <span className="sw-field-content">
              <span className="sw-field-label">Car Type</span>
              <select name="type" defaultValue="">
                <option value=""> Type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Compact">Compact</option>
                <option value="Luxury">Luxury</option>
              </select>
            </span>
          </label>
          <label className="sw-search-field">
            <span className="sw-field-content">
              <span className="sw-field-label">Price Range</span>
              <select name="price" defaultValue="">
                <option value=""> Price</option>
                <option value="1500">Up to 1,500 ETB/day</option>
                <option value="2000">Up to 2,000 ETB/day</option>
                <option value="3000">Up to 3,000 ETB/day</option>
              </select>
            </span>
          </label>
          <button type="submit" className="sw-search-button">
            <span aria-hidden="true">⌕</span> Search Cars
          </button>
        </form>
      </section>
      <section className="sw-featured">
        <div className="sw-section-heading">
          <div>
            <p className="sw-section-eyebrow">FIND YOUR NEXT RIDE</p>
            <h2>Featured vehicles</h2>
            <p className="sw-section-description">
              Explore cars available for rent around Addis Ababa.
            </p>
          </div>

          <Link href="/cars" className="sw-view-all">
            View all cars <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="sw-car-grid">
          {cars.map((car) => (
            <article className="sw-car-card" key={car.id}>
              <Link
                href={`/cars/${car.id}`}
                className="sw-car-image"
                aria-label={`View ${car.name}`}
              >
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                />
              </Link>
              <div className="sw-car-info">
                <div>
                  <h3>{car.name}</h3>
                  <p>
                    {car.type} · {car.transmission} · {car.seats} Seats
                  </p>
                </div>
                <p className="sw-car-price">
                  {car.price.toLocaleString()} <span>ETB/day</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
