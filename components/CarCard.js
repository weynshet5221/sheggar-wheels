import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import FavoriteButton from '@/components/FavoriteButton';

export default function CarCard({ car }) {
  const photo = car.photos?.[0] || car.image || '/images/cars/sedan.svg';
  const isRemotePhoto = /^https?:\/\//i.test(photo);
  const isDataPhoto = photo.startsWith('data:');

  return (
    <article className="car-card">
      <div className="car-img-wrapper">
        {isRemotePhoto ? (
          <img
            src={photo}
            alt={`${car.make} ${car.model}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={photo}
            alt={`${car.make} ${car.model}`}
            fill
            unoptimized={isDataPhoto}
            sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        )}

        <span className="badge">
          <MapPin size={12} aria-hidden="true" />{' '}{car.neighbourhood}
        </span>

        <div style={{ position: 'absolute', top: '.7rem', left: '.7rem', zIndex: 3 }}>
          <FavoriteButton carId={car.id} />
        </div>
      </div>

      <div className="car-info">
        <div>
          <h3 className="car-title">{car.make} {car.model}</h3>
          <p className="car-subtitle">{car.year} · {car.transmission} · {car.seats} seats</p>
          <p className="car-desc">{car.description}</p>
        </div>

        <div className="car-footer">
          <div className="price">
            {formatCurrency(car.pricePerDay)}<span> / day</span>
          </div>
          <Link href={`/cars/${car.id}`} className="btn-card">View details</Link>
        </div>
      </div>
    </article>
  );
}
