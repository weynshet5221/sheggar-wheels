
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { getCars, updateCarStatus } from "@/lib/cars";
import StatusBadge from "@/components/StatusBadge";

export default function AdminListingsPage() {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const activeUser = getCurrentSession();

    if (!activeUser || !activeUser.roles?.includes("admin")) {
      window.location.href = "/signin";
      return;
    }

    setUser(activeUser);
    setCars(getCars());
  }, []);

  const handleStatusChange = (carId, newStatus) => {
    updateCarStatus(carId, newStatus);
    setCars(getCars());
  };

  if (!user) return null;

  return (
    <main className="admin-listings-page">
      <div className="admin-listings-container">
        <h1 className="admin-listings-title">
          Manage Platform Listings
        </h1>

        <div className="admin-listings-card">
          {cars.length === 0 ? (
            <p className="admin-listings-empty">
              No car listings found.
            </p>
          ) : (
            cars.map((car) => (
              <div className="admin-listing-row" key={car.id}>
                <div className="admin-listing-info">
                  <h2>
                    {car.make} {car.model} ({car.year})
                  </h2>

                  <p>
                    Neighbourhood: {car.neighbourhood}
                    {" • "}
                    Owner ID: {car.ownerId}
                  </p>

                  <StatusBadge status={car.status} />
                </div>

                <div className="admin-listing-actions">
                  <Link
                    href={`/admin/listings/${car.id}`}
                    className="admin-view-button"
                  >
                    View Details
                  </Link>

                  {car.status !== "approved" && (
                    <button
                      type="button"
                      className="admin-approve-button"
                      onClick={() =>
                        handleStatusChange(car.id, "approved")
                      }
                    >
                      Approve
                    </button>
                  )}

                  {car.status !== "rejected" && (
                    <button
                      type="button"
                      className="admin-reject-button"
                      onClick={() =>
                        handleStatusChange(car.id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
