import { BookingCard } from "@/components/booking/booking-card";
import {
  getBookingsByGuestId,
  getPropertyById,
  mockUsers,
} from "@/lib/mock-data";

export default function GuestBookingsPage() {
  const guestBookings = getBookingsByGuestId("user-2");

  const bookingsWithDetails = guestBookings
    .map((booking) => {
      const property = getPropertyById(booking.propertyId);
      if (!property) return null;
      return { booking, property };
    })
    .filter(
      (
        item,
      ): item is {
        booking: (typeof guestBookings)[0];
        property: NonNullable<ReturnType<typeof getPropertyById>>;
      } => item !== null,
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
              guestName={
                mockUsers.find((u) => u.id === "user-2")?.name || "Guest"
              }
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
