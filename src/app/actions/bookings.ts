"use server";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { insertBookingSchema, updateBookingStatusSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth-server";
import { getBookingById, getPropertyById } from "@/db/queries";

export async function createBooking(formData: FormData) {
	try {
		// Check authentication
		const session = await getSession();
		if (!session?.user) {
			return {
				success: false,
				error: "You must be logged in to create a booking",
			};
		}

		// Extract data from FormData
		const rawData = {
			propertyId: Number.parseInt(formData.get("propertyId") as string),
			guestId: formData.get("guestId") as string,
			checkInDate: formData.get("checkInDate") as string,
			checkOutDate: formData.get("checkOutDate") as string,
			totalPrice: formData.get("totalPrice") as string,
			status: "pending" as const,
		};

		// Verify the guestId matches the authenticated user
		if (rawData.guestId !== session.user.id) {
			return {
				success: false,
				error: "Unauthorized: You can only create bookings for yourself",
			};
		}

		// Validate with Zod schema
		const validatedData = insertBookingSchema.parse(rawData);

		// Insert into database
		const [newBooking] = await db
			.insert(bookings)
			.values(validatedData)
			.returning();

		// Revalidate relevant pages
		revalidatePath("/guest/bookings");
		revalidatePath(`/properties/${rawData.propertyId}`);

		return {
			success: true,
			bookingId: newBooking.id.toString(),
		};
	} catch (error) {
		console.error("Error creating booking:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to create booking",
		};
	}
}

export async function updateBookingStatus(
	bookingId: string,
	status: "pending" | "accepted" | "declined" | "canceled",
) {
	try {
		// Check authentication
		const session = await getSession();
		if (!session?.user) {
			return {
				success: false,
				error: "You must be logged in to update a booking",
			};
		}

		// Validate input
		const validatedData = updateBookingStatusSchema.parse({ bookingId, status });

		// Get the booking to verify ownership
		const booking = await getBookingById(validatedData.bookingId);
		if (!booking) {
			return {
				success: false,
				error: "Booking not found",
			};
		}

		// Get the property to check if user is the host
		const property = await getPropertyById(booking.propertyId.toString());
		if (!property) {
			return {
				success: false,
				error: "Property not found",
			};
		}

		// Authorization checks based on action
		if (status === "canceled") {
			// Only the guest can cancel their own booking
			if (booking.guestId !== session.user.id) {
				return {
					success: false,
					error: "Unauthorized: You can only cancel your own bookings",
				};
			}
		} else if (status === "accepted" || status === "declined") {
			// Only the host can accept or decline bookings
			if (property.hostId !== session.user.id) {
				return {
					success: false,
					error:
						"Unauthorized: Only the property host can accept or decline bookings",
				};
			}
		}

		// Update in database
		await db
			.update(bookings)
			.set({ status: validatedData.status })
			.where(eq(bookings.id, Number.parseInt(validatedData.bookingId)));

		// Revalidate relevant pages
		revalidatePath("/host/bookings");
		revalidatePath("/guest/bookings");

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error updating booking status:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to update booking status",
		};
	}
}

export async function cancelBooking(bookingId: string) {
	return updateBookingStatus(bookingId, "canceled");
}

export async function acceptBooking(bookingId: string) {
	return updateBookingStatus(bookingId, "accepted");
}

export async function declineBooking(bookingId: string) {
	return updateBookingStatus(bookingId, "declined");
}
