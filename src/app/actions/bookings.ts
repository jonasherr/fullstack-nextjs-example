"use server";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { insertBookingSchema, updateBookingStatusSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createBooking(formData: FormData) {
	try {
		// Extract data from FormData
		const rawData = {
			propertyId: Number.parseInt(formData.get("propertyId") as string),
			guestId: formData.get("guestId") as string,
			checkInDate: formData.get("checkInDate") as string,
			checkOutDate: formData.get("checkOutDate") as string,
			totalPrice: formData.get("totalPrice") as string,
			status: "pending" as const,
		};

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
		// Validate input
		const validatedData = updateBookingStatusSchema.parse({ bookingId, status });

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
