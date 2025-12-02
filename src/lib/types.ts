import { bookings, properties, user } from "@/db/schema";

export type Property = typeof properties.$inferSelect;

export type Booking = typeof bookings.$inferSelect;

export type User = typeof user.$inferSelect;
