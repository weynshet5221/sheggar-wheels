"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAppStore = create(
  persist(
    (set) => ({
      favoritesByUser: {},
      theme: "light",

      toggleFavorite: (userId, carId) => {
        if (!userId || !carId) return;
        set((state) => {
          const currentFavorites = state.favoritesByUser[userId] || [];
          const nextFavorites = currentFavorites.includes(carId)
            ? currentFavorites.filter((id) => id !== carId)
            : [...currentFavorites, carId];

          return {
            favoritesByUser: {
              ...state.favoritesByUser,
              [userId]: nextFavorites,
            },
          };
        });
      },

      setTheme: (theme) => set({ theme }),

      clearFavorites: (userId) => {
        if (!userId) return;
        set((state) => ({
          favoritesByUser: { ...state.favoritesByUser, [userId]: [] },
        }));
      },
    }),
    {
      name: "sw-ui-preferences-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favoritesByUser: state.favoritesByUser,
        theme: state.theme,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState || {}),
        favoritesByUser: persistedState?.favoritesByUser || {},
        theme: persistedState?.theme || currentState.theme,
      }),
    }
  )
);
