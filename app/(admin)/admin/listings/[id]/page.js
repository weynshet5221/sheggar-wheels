
"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { getCars, updateCarStatus } from "@/lib/cars";
import StatusBadge from "@/components/StatusBadge";

export default function AdminCarDetailsPage({ params }) {
  return (
    <Suspense fallback={<main>Loading vehicle details...</main>}>
      <AdminCarDetailsContent params={params} />
    </Suspense>
  );
}

function AdminCarDetailsContent({ params }) {
  const { id } = use(params);

  const [car, setCar] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const activeUser = getCurrentSession();

    if (!activeUser || !activeUser.roles?.includes("admin")) {
      window.location.href = "/signin";
      return;
    }

    setUser(activeUser);

    const selectedCar = getCars().find(
      (item) => String(item.id) === String(id)
    );

    setCar(selectedCar || null);
  }, [id]);

  const handleStatusChange = (newStatus) => {
    updateCarStatus(car.id, newStatus);

    const updatedCar = getCars().find(
      (item) => String(item.id) === String(id)
    );

    setCar(updatedCar || null);
  };

  if (!user || !car) return null;

  const images = car.images || car.photos || [];
  const gallery = Array.isArray(images)
    ? images.map((image) =>
        typeof image === "string" ? image : image?.url
      ).filter(Boolean)
    : [];

  const mainImage =
    car.image || car.imageUrl || car.photo || car.coverImage;

  const allImages = [...new Set([mainImage, ...gallery].filter(Boolean))];

  const owner =
    typeof car.owner === "object" && car.owner !== null
      ? car.owner
      : {};

  const price =
    car.pricePerDay ??
    car.dailyPrice ??
    car.rentalPrice ??
    car.price;

  return (
    <main className="admin-listings-page">
      <div className="admin-car-details-page">
        <Link
          href="/admin/listings"
          className="admin-back-link"
        >
          ← Back to Listings
        </Link>

        <div className="admin-details-heading">
          <div>
            <h1>{car.make} {car.model}</h1>
            <p>Complete vehicle submission details</p>
          </div>

          <StatusBadge status={car.status} />
        </div>

        <section className="admin-details-card">
          <h2>Car Images</h2>

          <div className="admin-details-gallery">
            {allImages.length > 0 ? (
              allImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${car.make} ${car.model}`}
                />
              ))
            ) : (
              <p>No car images uploaded.</p>
            )}
          </div>
        </section>

        <section className="admin-details-card">
          <h2>Vehicle Information</h2>

          <div className="admin-details-grid">
            <Detail label="Make" value={car.make} />
            <Detail label="Model" value={car.model} />
            <Detail label="Year" value={car.year} />
            <Detail label="Daily Price" value={
              price != null ? `${Number(price).toLocaleString()} ETB` : null
            } />
            <Detail label="Neighbourhood" value={car.neighbourhood} />
            <Detail label="Transmission" value={car.transmission} />
            <Detail label="Fuel Type" value={car.fuelType} />
            <Detail label="Seats" value={car.seats} />
            <Detail label="Color" value={car.color} />
            <Detail label="Mileage" value={car.mileage} />
            <Detail label="Category" value={car.category} />
            <Detail label="License Plate" value={car.licensePlate} />
          </div>
        </section>

        {car.description && (
          <section className="admin-details-card">
            <h2>Description</h2>
            <p className="admin-details-description">
              {car.description}
            </p>
          </section>
        )}

        <section className="admin-details-card">
          <h2>Owner Information</h2>

          <div className="admin-details-grid">
            <Detail
              label="Owner Name"
              value={owner.name || car.ownerName}
            />
            <Detail
              label="Owner Email"
              value={owner.email || car.ownerEmail}
            />
            <Detail label="Owner ID" value={
              typeof car.ownerId === "object"
                ? car.ownerId?.id
                : car.ownerId
            } />
          </div>
        </section>

        <section className="admin-details-card">
          <h2>Moderation Decision</h2>

          <div className="admin-details-actions">
            {car.status !== "approved" && (
              <button
                type="button"
                className="admin-approve-button"
                onClick={() => handleStatusChange("approved")}
              >
                Approve Listing
              </button>
            )}

            {car.status !== "rejected" && (
              <button
                type="button"
                className="admin-reject-button"
                onClick={() => handleStatusChange("rejected")}
              >
                Reject Listing
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Detail({ label, value }) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="admin-details-item">
      <span>{label}</span>
      <strong>{String(value)}</strong>
    </div>
  );
}
