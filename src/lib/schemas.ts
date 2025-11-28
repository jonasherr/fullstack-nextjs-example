import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { properties, bookings } from "@/db/schema";
import { z } from "zod";

// Property schemas
export const insertPropertySchema = createInsertSchema(properties, {
	name: z.string().min(1, "Name is required"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	street: z.string().min(1, "Street address is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	zipCode: z.string().min(1, "ZIP code is required"),
	pricePerNight: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
	maxGuests: z.number().min(1, "Must accommodate at least 1 guest"),
	numBedrooms: z.number().min(1, "Must have at least 1 bedroom"),
	images: z
		.array(z.string().url("Invalid image URL"))
		.min(1, "At least one image is required")
		.max(10, "Maximum 10 images allowed"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectPropertySchema = createSelectSchema(properties);

// Booking schemas
export const insertBookingSchema = createInsertSchema(bookings, {
	checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
	checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
	totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectBookingSchema = createSelectSchema(bookings);

// Additional validation schemas for forms
export const createPropertyFormSchema = insertPropertySchema;

export const createBookingFormSchema = insertBookingSchema
	.pick({
		propertyId: true,
		guestId: true,
		checkInDate: true,
		checkOutDate: true,
		totalPrice: true,
	})
	.refine(
		(data) => {
			const checkIn = new Date(data.checkInDate);
			const checkOut = new Date(data.checkOutDate);
			return checkOut > checkIn;
		},
		{
			message: "Check-out date must be after check-in date",
			path: ["checkOutDate"],
		},
	);

export const updateBookingStatusSchema = z.object({
	bookingId: z.string(),
	status: z.enum(["pending", "accepted", "declined", "canceled"]),
});

// Types
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type SelectProperty = z.infer<typeof selectPropertySchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type SelectBooking = z.infer<typeof selectBookingSchema>;
export type UpdateBookingStatus = z.infer<typeof updateBookingStatusSchema>;
