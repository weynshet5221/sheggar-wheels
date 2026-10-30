"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CarGrid from "@/components/CarGrid";
import { getCars } from "@/lib/cars";
import { getCurrentSession } from "@/lib/auth";
import { useAppStore } from "@/lib/store";

export default function FavoritesPage() {
  const router = useRouter();
  const favoritesByUser = useAppStore((state) => state.favoritesByUser);
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const activeUser = getCurrentSession();
    if (!activeUser) {
      router.replace("/signin?next=/favorites");
      return;
    }
    if (activeUser.activeRole !== "renter") {
      const destinations = { owner: "/owner/dashboard", admin: "/admin/dashboard" };
      router.replace(destinations[activeUser.activeRole] || "/signin");
      return;
    }

    setUser(activeUser);
    setCars(getCars({ status: "approved" }));
    setIsMounted(true);
  }, [router]);

  const favorites = user ? favoritesByUser[user.id] || [] : [];
  const favoriteCars = cars.filter((car) => favorites.includes(car.id));

  if (!isMounted || !user) {
    return <section className="favorites-page"><p>Loading your favorites...</p></section>;
  }

  return (
    <section className="favorites-page">
      <div className="favorites-heading">
        <p className="home-eyebrow">YOUR PERSONAL COLLECTION</p>
        <h1>My favorites</h1>
        <p>Keep the cars you love in one place.</p>
      </div>

      {favoriteCars.length > 0 ? (
        <CarGrid cars={favoriteCars} />
      ) : (
        <div className="favorites-empty">
          <div className="favorites-heart" aria-hidden="true">♡</div>
          <h2>No favorite cars yet</h2>
          <p>Browse available cars and tap the heart on any car you want to save here.</p>
          <Link href="/cars" className="home-hero-button">Browse cars <span aria-hidden="true">→</span></Link>
        </div>
      )}
    </section>
  );
}
