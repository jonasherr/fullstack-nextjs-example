import { BookingCard } from "@/app/guest/bookings/components/booking-card";
import { Badge } from "@/components/ui/badge";
import { BookingsWithGuests } from "@/db/queries";

interface PropertyBookingsListProps {
  bookings: BookingsWithGuests;
  title: string;
  emptyMessage: string;
  showCancelAction?: boolean;
}

export function PropertyBookingsList({
  bookings,
  title,
  emptyMessage,
  showCancelAction,
}: PropertyBookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="secondary">{bookings.length}</Badge>
      </div>
      <div className="space-y-3">
        {bookings.map(({ guestName, property, ...booking }) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            property={property}
            guestName={guestName}
            showActions={booking.status === "pending"}
            showCancelAction={showCancelAction}
          />
        ))}
      </div>
    </div>
  );
}
