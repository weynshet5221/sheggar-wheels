import { STORAGE_KEYS, BOOKING_STATUS } from "./constants";
import { readStorage, writeStorage } from "./storage";

export function getBookings(filters = {}) {
  const bookings = readStorage(STORAGE_KEYS.BOOKINGS, []);
  let migrated = false;

  for (const booking of bookings) {
    if (
      booking.status === BOOKING_STATUS.REQUESTED &&
      booking.paymentStatus === "paid"
    ) {
      booking.paymentStatus = "pending";
      booking.transactionRef = null;
      booking.paymentMethod = null;
      booking.paidAt = null;
      migrated = true;
    }
  }

  if (migrated) writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

  return bookings.filter((booking) => {
    if (filters.renterId && booking.renterId !== filters.renterId) return false;
    if (filters.ownerId && booking.ownerId !== filters.ownerId) return false;
    if (filters.carId && booking.carId !== filters.carId) return false;
    if (filters.status && booking.status !== filters.status) return false;
    return true;
  });
}

export function createBooking(bookingData, currentUserId) {
  if (!currentUserId) {
    throw new Error("Please sign in before requesting a booking.");
  }

  if (
    !bookingData?.carId ||
    !bookingData?.ownerId ||
    !bookingData?.startDate ||
    !bookingData?.endDate
  ) {
    throw new Error("Booking information is incomplete.");
  }

  if (bookingData.ownerId === currentUserId) {
    throw new Error("You cannot book your own vehicle.");
  }

  if (bookingData.endDate <= bookingData.startDate) {
    throw new Error("The return date must be after the pickup date.");
  }

  const bookings = readStorage(STORAGE_KEYS.BOOKINGS, []);

  const hasOverlap = bookings.some((booking) => {
    if (booking.carId !== bookingData.carId) return false;

    if (
      [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.DECLINED].includes(
        booking.status
      )
    ) {
      return false;
    }

    return (
      bookingData.startDate < booking.endDate &&
      bookingData.endDate > booking.startDate
    );
  });

  if (hasOverlap) {
    throw new Error(
      "This vehicle is already requested or booked for those dates."
    );
  }

  const newBooking = {
    ...bookingData,
    id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    renterId: currentUserId,
    status: BOOKING_STATUS.REQUESTED,
    paymentStatus: "pending",
    transactionRef: null,
    paymentMethod: null,
    paidAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

  return newBooking;
}

export function updateBookingStatus(bookingId, nextStatus, currentUserId) {
  const bookings = readStorage(STORAGE_KEYS.BOOKINGS, []);

  const index = bookings.findIndex(
    (booking) => String(booking.id) === String(bookingId)
  );

  if (index === -1) throw new Error("Booking not found.");

  const booking = bookings[index];
  const isOwner = booking.ownerId === currentUserId;
  const isRenter = booking.renterId === currentUserId;

  if (
    [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.DECLINED].includes(nextStatus)
  ) {
    if (!isOwner || booking.status !== BOOKING_STATUS.REQUESTED) {
      throw new Error(
        "Only the car owner can respond to a pending request."
      );
    }
  } else if (nextStatus === BOOKING_STATUS.CANCELLED) {
    if (
      !isRenter ||
      ![BOOKING_STATUS.REQUESTED, BOOKING_STATUS.CONFIRMED].includes(
        booking.status
      ) ||
      booking.paymentStatus === "paid"
    ) {
      throw new Error("This booking can no longer be cancelled by the renter.");
    }
  } else if (nextStatus === BOOKING_STATUS.IN_PROGRESS) {
    if (
      !isOwner ||
      booking.status !== BOOKING_STATUS.CONFIRMED ||
      booking.paymentStatus !== "paid"
    ) {
      throw new Error(
        "The owner can start the rental only after payment is confirmed."
      );
    }
  } else if (nextStatus === BOOKING_STATUS.COMPLETED) {
    if (!isOwner || booking.status !== BOOKING_STATUS.IN_PROGRESS) {
      throw new Error(
        "Only the owner can confirm a vehicle return after the rental has started."
      );
    }
  } else {
    throw new Error("That booking status change is not allowed.");
  }

  booking.status = nextStatus;
  booking.updatedAt = new Date().toISOString();

  bookings[index] = booking;
  writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

  return booking;
}

export function completeBookingPayment(bookingId, paymentMethod, currentUserId) {
  const bookings = readStorage(STORAGE_KEYS.BOOKINGS, []);

  const index = bookings.findIndex(
    (booking) => String(booking.id) === String(bookingId)
  );

  if (index === -1) throw new Error("Booking not found.");

  const booking = bookings[index];

  if (booking.renterId !== currentUserId) {
    throw new Error("Only the renter can pay for this booking.");
  }

  if (booking.status !== BOOKING_STATUS.CONFIRMED) {
    throw new Error(
      "Payment is available after the owner approves the request."
    );
  }

  if (booking.paymentStatus === "paid") {
    throw new Error("This booking has already been paid.");
  }

  if (!["telebirr", "card"].includes(paymentMethod)) {
    throw new Error("Choose a valid payment method.");
  }

  booking.paymentStatus = "paid";
  booking.paymentMethod = paymentMethod;
  booking.transactionRef = `SW-${Date.now().toString(36).toUpperCase()}`;
  booking.paidAt = new Date().toISOString();
  booking.updatedAt = new Date().toISOString();

  bookings[index] = booking;
  writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

  return booking;
}