import { STORAGE_KEYS, BOOKING_STATUS } from "./constants";
import { readStorage, writeStorage } from "./storage";

export function getReviews(filters = {}) {
  const reviews = readStorage(STORAGE_KEYS.REVIEWS, []);

  return reviews.filter((review) => {
    if (filters.bookingId && review.bookingId !== filters.bookingId) return false;
    if (filters.carId && review.carId !== filters.carId) return false;
    if (filters.ownerId && review.ownerId !== filters.ownerId) return false;
    if (filters.renterId && review.renterId !== filters.renterId) return false;
    return true;
  });
}

export function createReview({ bookingId, rating, comment }, currentUserId) {
  if (!currentUserId) {
    throw new Error("Please sign in to leave a review.");
  }

  const bookings = readStorage(STORAGE_KEYS.BOOKINGS, []);

  const booking = bookings.find(
    (item) => String(item.id) === String(bookingId)
  );

  if (!booking) throw new Error("Booking not found.");

  if (booking.renterId !== currentUserId) {
    throw new Error("Only the renter can review this booking.");
  }

  if (booking.status !== BOOKING_STATUS.COMPLETED) {
    throw new Error(
      "You can review the trip after the owner confirms the car return."
    );
  }

  const reviews = readStorage(STORAGE_KEYS.REVIEWS, []);

  if (
    reviews.some(
      (review) => String(review.bookingId) === String(bookingId)
    )
  ) {
    throw new Error("A review has already been submitted for this booking.");
  }

  const numericRating = Number(rating);
  const cleanComment = String(comment || "").trim();

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    throw new Error("Choose a rating from 1 to 5.");
  }

  if (cleanComment.length < 5) {
    throw new Error("Please write at least 5 characters in your review.");
  }

  const newReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    bookingId,
    carId: booking.carId,
    ownerId: booking.ownerId,
    renterId: currentUserId,
    rating: numericRating,
    comment: cleanComment,
    ownerReply: null,
    createdAt: new Date().toISOString(),
  };

  reviews.push(newReview);
  writeStorage(STORAGE_KEYS.REVIEWS, reviews);

  booking.status = BOOKING_STATUS.REVIEWED;
  booking.updatedAt = new Date().toISOString();

  writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

  return newReview;
}

export function replyToReview(reviewId, replyText, currentUserId) {
  const reviews = readStorage(STORAGE_KEYS.REVIEWS, []);

  const index = reviews.findIndex(
    (review) => String(review.id) === String(reviewId)
  );

  if (index === -1) throw new Error("Review not found.");

  if (reviews[index].ownerId !== currentUserId) {
    throw new Error("Only the car owner can reply to this review.");
  }

  const cleanReply = String(replyText || "").trim();

  if (cleanReply.length < 2) {
    throw new Error("Please enter a reply before submitting.");
  }

  reviews[index].ownerReply = cleanReply;
  reviews[index].repliedAt = new Date().toISOString();

  writeStorage(STORAGE_KEYS.REVIEWS, reviews);

  return reviews[index];
}