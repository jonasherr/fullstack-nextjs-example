import { BookingCard } from "@/components/booking/booking-card";
import {
  getBookingsByGuestId,
  getPropertyById,
  getUserByEmail,
} from "@/db/queries";

export default async function GuestBookingsPage() {
  // TODO: Replace with actual session user ID in Phase 6
  const guestUser = await getUserByEmail("guest@example.com");
  if (!guestUser) {
    return <div>Guest not found</div>;
  }

  const guestBookings = await getBookingsByGuestId(guestUser.id);

  const bookingsWithDetails = await Promise.all(
    guestBookings.map(async (booking) => {
      const property = await getPropertyById(booking.propertyId);
      if (!property) return null;
      return { booking, property };
    }),
  ).then((results) =>
    results.filter((item): item is NonNullable<typeof item> => item !== null),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      {bookingsWithDetails.length > 0 ? (
        <div className="space-y-4">
          {bookingsWithDetails.map(({ booking, property }) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              property={property}
              guestName={guestUser.name}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            You don't have any bookings yet.
          </p>
        </div>
      )}
    </div>
  );
}
