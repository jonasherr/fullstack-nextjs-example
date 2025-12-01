import { and, count, desc, eq, gte, lte, or, sql } from "drizzle-orm";
import type { Booking, Property } from "@/lib/types";
import { db } from "./index";
import { bookings, favorites, properties, user } from "./schema";

// Transform database property to UI Property type (with address object)
function transformProperty(
  dbProperty: typeof properties.$inferSelect,
): Property {
  return {
    id: dbProperty.id.toString(),
    hostId: dbProperty.hostId,
    name: dbProperty.name,
    description: dbProperty.description,
    address: {
      street: dbProperty.street,
      city: dbProperty.city,
      state: dbProperty.state,
      country: dbProperty.country,
      zipCode: dbProperty.zipCode,
    },
    pricePerNight: Number(dbProperty.pricePerNight),
    maxGuests: dbProperty.maxGuests,
    numBedrooms: dbProperty.numBedrooms,
    images: dbProperty.images,
    status: dbProperty.status,
    createdAt: dbProperty.createdAt.toISOString(),
  };
}

// Transform database booking to UI Booking type
function transformBooking(dbBooking: typeof bookings.$inferSelect): Booking {
  return {
    id: dbBooking.id.toString(),
    propertyId: dbBooking.propertyId.toString(),
    guestId: dbBooking.guestId,
    checkInDate: dbBooking.checkInDate,
    checkOutDate: dbBooking.checkOutDate,
    status: dbBooking.status,
    totalPrice: Number(dbBooking.totalPrice),
    createdAt: dbBooking.createdAt.toISOString(),
  };
}

// Get all active properties
export async function getAllProperties(): Promise<Property[]> {
  const result = await db
    .select()
    .from(properties)
    .where(eq(properties.status, "active"))
    .orderBy(properties.createdAt);

  return result.map(transformProperty);
}

// Get property by ID
export async function getPropertyById(
  id: string,
): Promise<Property | undefined> {
  "use cache";
  const result = await db
    .select()
    .from(properties)
    .where(eq(properties.id, Number.parseInt(id)))
    .limit(1);

  return result[0] ? transformProperty(result[0]) : undefined;
}

// Search and filter properties
export async function searchProperties(filters: {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  checkInDate?: string;
  checkOutDate?: string;
}): Promise<Property[]> {
  const conditions = [eq(properties.status, "active")];

  // Location filter (searches both city and state, case-insensitive partial match)
  if (filters.city) {
    conditions.push(
      or(
        sql`${properties.city} ILIKE ${`%${filters.city}%`}`,
        sql`${properties.state} ILIKE ${`%${filters.city}%`}`,
      )!,
    );
  }

  // Price range filter
  if (filters.minPrice) {
    conditions.push(gte(properties.pricePerNight, filters.minPrice.toString()));
  }
  if (filters.maxPrice) {
    conditions.push(lte(properties.pricePerNight, filters.maxPrice.toString()));
  }

  // Guest capacity filter
  if (filters.minGuests) {
    conditions.push(gte(properties.maxGuests, filters.minGuests));
  }

  // Date availability filter - exclude properties with overlapping bookings
  if (filters.checkInDate && filters.checkOutDate) {
    // Get property IDs with overlapping accepted bookings
    const overlappingBookings = await db
      .select({ propertyId: bookings.propertyId })
      .from(bookings)
      .where(
        and(
          eq(bookings.status, "accepted"),
          sql`${bookings.checkInDate} < ${filters.checkOutDate}`,
          sql`${bookings.checkOutDate} > ${filters.checkInDate}`,
        ),
      );

    const unavailablePropertyIds = overlappingBookings.map((b) => b.propertyId);

    if (unavailablePropertyIds.length > 0) {
      conditions.push(
        sql`${properties.id} NOT IN (${sql.join(unavailablePropertyIds, sql`, `)})`,
      );
    }
  }

  const result = await db
    .select()
    .from(properties)
    .where(and(...conditions))
    .orderBy(properties.createdAt);

  return result.map(transformProperty);
}

// Get properties by host ID
export async function getPropertiesByHostId(
  hostId: string,
): Promise<Property[]> {
  const result = await db
    .select()
    .from(properties)
    .where(eq(properties.hostId, hostId))
    .orderBy(properties.createdAt);

  return result.map(transformProperty);
}

// Get bookings by property ID
export async function getBookingsByPropertyId(
  propertyId: string,
): Promise<Booking[]> {
  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.propertyId, Number.parseInt(propertyId)))
    .orderBy(bookings.createdAt);

  return result.map(transformBooking);
}

// Get bookings by guest ID
export async function getBookingsByGuestId(
  guestId: string,
): Promise<Booking[]> {
  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.guestId, guestId))
    .orderBy(bookings.createdAt);

  return result.map(transformBooking);
}

// Get bookings with property details by guest ID (optimized - single query with join)
export async function getBookingsWithPropertiesByGuestId(guestId: string) {
  const result = await db
    .select({
      booking: bookings,
      property: properties,
    })
    .from(bookings)
    .innerJoin(properties, eq(bookings.propertyId, properties.id))
    .where(eq(bookings.guestId, guestId))
    .orderBy(bookings.createdAt);

  return result.map((row) => ({
    booking: transformBooking(row.booking),
    property: transformProperty(row.property),
  }));
}

// Get bookings for properties owned by a host
export async function getBookingsByHostId(hostId: string): Promise<Booking[]> {
  const result = await db
    .select({
      id: bookings.id,
      propertyId: bookings.propertyId,
      guestId: bookings.guestId,
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
    })
    .from(bookings)
    .innerJoin(properties, eq(bookings.propertyId, properties.id))
    .where(eq(properties.hostId, hostId))
    .orderBy(bookings.createdAt);

  return result.map(transformBooking);
}

// Get a specific booking by ID
export async function getBookingById(
  bookingId: string,
): Promise<Booking | null> {
  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, Number.parseInt(bookingId)))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return transformBooking(result[0]);
}

// Get accepted bookings for a property (for checking availability)
export async function getAcceptedBookingsForProperty(
  propertyId: string,
): Promise<Booking[]> {
  const result = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.propertyId, Number.parseInt(propertyId)),
        eq(bookings.status, "accepted"),
      ),
    )
    .orderBy(bookings.checkInDate);

  return result.map(transformBooking);
}

// Get user by ID
export async function getUserById(userId: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return result[0];
}

// Get user by email
export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return result[0];
}

// ==================== Favorite Queries ====================

// Check if a property is favorited by a user
export async function isFavorited(
  userId: string,
  propertyId: string,
): Promise<boolean> {
  const result = await db
    .select()
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.propertyId, parseInt(propertyId)),
      ),
    )
    .limit(1);

  return result.length > 0;
}

// Get all properties favorited by a user
export async function getFavoritesByUserId(userId: string) {
  const result = await db
    .select({
      property: properties,
      favoritedAt: favorites.createdAt,
    })
    .from(favorites)
    .innerJoin(properties, eq(favorites.propertyId, properties.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));

  return result.map((row) => ({
    property: transformProperty(row.property),
    favoritedAt: row.favoritedAt.toISOString(),
  }));
}

// Get favorite count for a property (optional - for analytics)
export async function getFavoriteCount(propertyId: number): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(favorites)
    .where(eq(favorites.propertyId, propertyId));

  return result[0]?.count ?? 0;
}
