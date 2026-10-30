import { STORAGE_KEYS } from './constants';
import { getInitialSeedData } from './seed';

export function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing localStorage key "${key}":`, err);
  }
}

export function readSession(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.sessionStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading sessionStorage key "${key}":`, err);
    return fallback;
  }
}

export function writeSession(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing sessionStorage key "${key}":`, err);
  }
}

export function removeSession(key) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(key);
}

export function initializeDemoData() {
  if (typeof window === 'undefined') return;
  const existingUsers = window.localStorage.getItem(STORAGE_KEYS.USERS);
  if (!existingUsers) {
    const seed = getInitialSeedData();
    writeStorage(STORAGE_KEYS.USERS, seed.users);
    writeStorage(STORAGE_KEYS.CARS, seed.cars);
    writeStorage(STORAGE_KEYS.BOOKINGS, seed.bookings);
    writeStorage(STORAGE_KEYS.REVIEWS, seed.reviews);
    writeStorage(STORAGE_KEYS.DISPUTES, seed.disputes);
    writeStorage(STORAGE_KEYS.ANNOUNCEMENTS, seed.announcements);
  }
}

export function resetDemoData() {
  if (typeof window === 'undefined') return;
  window.localStorage.clear();
  window.sessionStorage.clear();
  initializeDemoData();
}