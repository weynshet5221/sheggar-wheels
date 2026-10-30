"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getCurrentSession } from "@/lib/auth";
import { useAppStore } from "@/lib/store";

export default function FavoriteButton({ carId }) {
  const [user, setUser] = useState(null);
  const favoritesByUser = useAppStore((state) => state.favoritesByUser);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  useEffect(() => {
    setUser(getCurrentSession());
  }, []);

  if (!user?.id || user.activeRole !== "renter") return null;

  const favorites = favoritesByUser[user.id] || [];
  const active = favorites.includes(carId);

  return (
    <button
      type="button"
      className="favorite-button"
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={active}
      title={active ? "Remove from favourites" : "Add to favourites"}
      onClick={() => toggleFavorite(user.id, carId)}
    >
      <Heart size={18} fill={active ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
