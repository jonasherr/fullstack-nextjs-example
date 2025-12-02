import { getBookingsWithGuests, getPropertyById } from "@/db/queries";
import { getSession } from "@/lib/auth-server";
import { PropertyBookingsList } from "./property-bookings-list";

interface PropertyBookingsSectionProps {
  propertyId: number;
}

export async function PropertyBookingsSection({
  propertyId,
}: PropertyBookingsSectionProps) {
  const [session, property] = await Promise.all([
    getSession(),
    getPropertyById(propertyId),
  ]);
  if (!property) {
    return null;
  }

  const isHost = session?.user && property.hostId === session.user.id;
  if (!isHost) return null;

  // Fetch all bookings with guest info in a single query
  const bookingsWithGuests = await getBookingsWithGuests(propertyId);

  // If no bookings, show empty state
  if (bookingsWithGuests.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Manage Bookings</h2>
        <p className="text-muted-foreground">
          No bookings yet for this property.
        </p>
      </div>
    );
  }

  // Get current date for past booking check
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  // Group bookings by status
  const pendingBookings = bookingsWithGuests
    .filter((item) => item.status === "pending")
    .sort(
      (a, b) =>
        new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime(),
    );

  const acceptedBookings = bookingsWithGuests
    .filter((item) => item.status === "accepted")
    .sort(
      (a, b) =>
        new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime(),
    );

  const pastBookings = bookingsWithGuests
    .filter((item) => {
      const checkOutDate = new Date(item.checkOutDate);
      checkOutDate.setHours(0, 0, 0, 0);
      return (
        item.status === "declined" ||
        item.status === "canceled" ||
        checkOutDate < now
      );
    })
    .sort(
      (a, b) =>
        new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime(),
    );

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Manage Bookings</h2>
      <div className="space-y-8">
        {pendingBookings.length > 0 && (
          <PropertyBookingsList
            bookings={pendingBookings}
            title="Pending Requests"
            emptyMessage="No pending booking requests"
          />
        )}

        {acceptedBookings.length > 0 && (
          <PropertyBookingsList
            bookings={acceptedBookings}
            title="Accepted Bookings"
            emptyMessage="No accepted bookings"
            showCancelAction
          />
        )}

        {pastBookings.length > 0 && (
          <PropertyBookingsList
            bookings={pastBookings}
            title="Past Bookings"
            emptyMessage="No past bookings"
          />
        )}
      </div>
    </div>
  );
}
