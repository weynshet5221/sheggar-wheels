import { STORAGE_KEYS, CAR_STATUS } from "./constants";
import { readStorage, writeStorage } from "./storage";
import { getCurrentSession } from "./auth";

const VALID_CAR_STATUSES = Object.values(CAR_STATUS);

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getCars(filters = {}) {
  const cars = readStorage(STORAGE_KEYS.CARS, []);
  if (!Array.isArray(cars)) return [];

  return cars.filter((car) => {
    if (filters.status && car.status !== filters.status) return false;
    if (filters.ownerId && car.ownerId !== filters.ownerId) return false;

    if (
      filters.neighbourhood &&
      normalize(car.neighbourhood) !== normalize(filters.neighbourhood)
    ) return false;

    if (filters.city && normalize(car.city) !== normalize(filters.city)) {
      return false;
    }

    if (
      filters.transmission &&
      normalize(car.transmission) !== normalize(filters.transmission)
    ) return false;

    if (
      filters.minPrice !== undefined &&
      filters.minPrice !== "" &&
      Number(car.pricePerDay) < Number(filters.minPrice)
    ) return false;

    if (
      filters.maxPrice !== undefined &&
      filters.maxPrice !== "" &&
      Number(car.pricePerDay) > Number(filters.maxPrice)
    ) return false;

    if (
      filters.minSeats !== undefined &&
      filters.minSeats !== "" &&
      Number(car.seats) < Number(filters.minSeats)
    ) return false;

    if (filters.search) {
      const query = normalize(filters.search);
      const searchableText = [
        car.make,
        car.model,
        car.description,
        car.neighbourhood,
        car.city,
      ].map(normalize).join(" ");

      if (!searchableText.includes(query)) return false;
    }

    if (filters.startDate && filters.endDate) {
      const unavailableDates = Array.isArray(car.unavailableDates)
        ? car.unavailableDates
        : [];

      const hasUnavailableDate = unavailableDates.some(
        (date) => date >= filters.startDate && date < filters.endDate
      );

      if (hasUnavailableDate) return false;

      const bookings = readStorage(STORAGE_KEYS.BOOKINGS, []);
      const activeStatuses = ["requested", "confirmed", "in_progress"];
      const hasBookingConflict = Array.isArray(bookings) && bookings.some((booking) => {
        if (booking.carId !== car.id) return false;
        if (!activeStatuses.includes(booking.status)) return false;
        return booking.startDate < filters.endDate && booking.endDate > filters.startDate;
      });

      if (hasBookingConflict) return false;
    }

    return true;
  });
}

export function getCarById(id) {
  const cars = readStorage(STORAGE_KEYS.CARS, []);
  if (!Array.isArray(cars)) return null;
  return cars.find((car) => String(car.id) === String(id)) || null;
}

export function saveCar(carData, currentUserId) {
  const session = getCurrentSession();

  if (!session || session.id !== currentUserId) {
    throw new Error("Not signed in: Please sign in before saving a car listing.");
  }

  if (session.activeRole !== "owner") {
    throw new Error("Not authorized: Switch to your owner account to manage listings.");
  }

  const make = String(carData.make || "").trim();
  const model = String(carData.model || "").trim();
  const pricePerDay = Number(carData.pricePerDay);
  const year = Number(carData.year);
  const seats = Number(carData.seats);

  if (!make || !model) throw new Error("Enter the car make and model.");
  if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
    throw new Error("Daily price must be greater than zero.");
  }
  if (!Number.isInteger(year) || year < 1980 || year > new Date().getFullYear() + 1) {
    throw new Error("Enter a valid vehicle year.");
  }
  if (!Number.isInteger(seats) || seats < 1 || seats > 30) {
    throw new Error("Seats must be between 1 and 30.");
  }

  const cars = readStorage(STORAGE_KEYS.CARS, []);
  const safeCars = Array.isArray(cars) ? cars : [];

  if (carData.id) {
    const existingIndex = safeCars.findIndex((car) => car.id === carData.id);
    if (existingIndex === -1) throw new Error("Car not found.");

    if (safeCars[existingIndex].ownerId !== currentUserId) {
      throw new Error("Not yours: You cannot edit another owner's car.");
    }

    const updatedCar = {
      ...safeCars[existingIndex],
      ...carData,
      make,
      model,
      year,
      seats,
      pricePerDay,
      ownerId: currentUserId,
      updatedAt: new Date().toISOString(),
    };

    safeCars[existingIndex] = updatedCar;
    writeStorage(STORAGE_KEYS.CARS, safeCars);
    return updatedCar;
  }

  const newCar = {
    ...carData,
    id: `car-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
    ownerId: currentUserId,
    make,
    model,
    year,
    seats,
    pricePerDay,
    status: CAR_STATUS.PENDING,
    createdAt: new Date().toISOString(),
  };

  safeCars.push(newCar);
  writeStorage(STORAGE_KEYS.CARS, safeCars);
  return newCar;
}

export function updateCarStatus(carId, newStatus) {
  const session = getCurrentSession();

  if (!session || session.activeRole !== "admin") {
    throw new Error("Not authorized: Only an admin can moderate car listings.");
  }

  if (!VALID_CAR_STATUSES.includes(newStatus)) {
    throw new Error("Invalid car status.");
  }

  const cars = readStorage(STORAGE_KEYS.CARS, []);
  if (!Array.isArray(cars)) throw new Error("Car data could not be read.");

  const index = cars.findIndex((car) => car.id === carId);
  if (index === -1) throw new Error("Car not found.");

  cars[index] = { ...cars[index], status: newStatus, updatedAt: new Date().toISOString() };
  writeStorage(STORAGE_KEYS.CARS, cars);
  return cars[index];
}
