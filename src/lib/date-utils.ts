import type { Booking } from "@/lib/types";

/**
 * Generates an array of Date objects representing dates that should be
 * disabled in the calendar based on accepted bookings.
 *
 * Uses same-day turnover logic: disables check-in day through day BEFORE check-out.
 * Example: Booking from Dec 1-5 disables Dec 1, 2, 3, 4 (Dec 5 is available).
 *
 * @param bookings - Array of accepted bookings for a property
 * @returns Array of Date objects to disable in the calendar
 */
export function getDisabledDatesFromBookings(bookings: Booking[]): Date[] {
	const disabledDates: Date[] = [];

	for (const booking of bookings) {
		const checkIn = new Date(booking.checkInDate);
		const checkOut = new Date(booking.checkOutDate);

		// Disable dates from check-in up to (but not including) check-out
		// This allows same-day turnover: new guests can check in on checkout day
		let currentDate = new Date(checkIn);
		while (currentDate < checkOut) {
			// Create new Date object to avoid mutation
			disabledDates.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}
	}

	return disabledDates;
}

/**
 * Checks if a requested booking overlaps with any existing accepted bookings.
 *
 * Uses same-day turnover logic: a new booking CAN start on an existing booking's
 * checkout day.
 *
 * We compare date strings directly to avoid timezone issues.
 *
 * @param checkInDate - Requested check-in date (YYYY-MM-DD format)
 * @param checkOutDate - Requested check-out date (YYYY-MM-DD format)
 * @param existingBookings - Array of accepted bookings to check against
 * @returns true if overlap detected, false if dates are available
 */
export function checkBookingOverlap(
	checkInDate: string,
	checkOutDate: string,
	existingBookings: Booking[],
): boolean {
	for (const booking of existingBookings) {
		// Compare date strings directly to avoid timezone issues
		// Booking overlaps if:
		// - New check-in is BEFORE existing check-out (not on same day)
		// - AND new check-out is AFTER existing check-in
		//
		// For same-day turnover: requestedCheckIn < existingCheckOut
		// - If requestedCheckIn == existingCheckOut (same day), < returns FALSE → no overlap ✓
		//
		// Examples:
		// Existing: 2024-12-01 to 2024-12-05
		// New: 2024-12-05 to 2024-12-10 → "2024-12-05" < "2024-12-05" = FALSE → OK
		// New: 2024-12-03 to 2024-12-07 → "2024-12-03" < "2024-12-05" = TRUE → OVERLAP

		const overlaps =
			checkInDate < booking.checkOutDate && checkOutDate > booking.checkInDate;

		if (overlaps) {
			return true;
		}
	}

	return false;
}
