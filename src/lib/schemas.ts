import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { bookings, properties } from "@/db/schema";

// Property schemas
export const maximumImagesPerProperty = 3;
export const insertPropertySchema = createInsertSchema(properties, {
  name: z.string("Name is required").min(1),
  description: z.string().min(10, "Description must be at least 10 characters"),
  street: z.string("Street address is required").min(1),
  city: z.string("City is required").min(1),
  state: z.string("State is required").min(1),
  zipCode: z.string("ZIP code is required").min(1),
  pricePerNight: z
    .string("Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  maxGuests: z.number("Must accommodate at least 1 guest").min(1),
  numBedrooms: z.number("Must have at least 1 bedroom").min(1),
  images: z
    .array(z.url("Invalid image URL"))
    .min(1, "At least one image is required")
    .max(
      maximumImagesPerProperty,
      `Maximum ${maximumImagesPerProperty} images allowed`,
    ),
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
  bookingId: z.number(),
  status: z.enum(["pending", "accepted", "declined", "canceled"]),
});

// Types
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type SelectProperty = z.infer<typeof selectPropertySchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type SelectBooking = z.infer<typeof selectBookingSchema>;
export type UpdateBookingStatus = z.infer<typeof updateBookingStatusSchema>;
