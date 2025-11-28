import { BookingCard } from "@/components/booking/booking-card";
import {
  getBookingsByHostId,
  getPropertyById,
  mockUsers,
} from "@/lib/mock-data";

export default function HostBookingsPage() {
  const hostBookings = getBookingsByHostId("user-1");

  const bookingsWithDetails = hostBookings
    .map((booking) => {
      const property = getPropertyById(booking.propertyId);
      const guest = mockUsers.find((u) => u.id === booking.guestId);
      if (!property || !guest) return null;
      return { booking, property, guest };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const pendingBookings = bookingsWithDetails.filter(
    (b) => b.booking.status === "pending",
  );
  const otherBookings = bookingsWithDetails.filter(
    (b) => b.booking.status !== "pending",
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Booking Requests</h1>

      {pendingBookings.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingBookings.map(({ booking, property, guest }) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                property={property}
                guestName={guest.name}
                showActions
              />
            ))}
          </div>
        </section>
      )}

      {otherBookings.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
          <div className="space-y-4">
            {otherBookings.map(({ booking, property, guest }) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                property={property}
                guestName={guest.name}
              />
            ))}
          </div>
        </section>
      )}

      {bookingsWithDetails.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            You don't have any bookings yet.
          </p>
        </div>
      )}
    </div>
  );
}
