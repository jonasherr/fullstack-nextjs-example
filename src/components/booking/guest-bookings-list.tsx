import Link from "next/link";
import { redirect } from "next/navigation";
import { BookingCard } from "@/components/booking/booking-card";
import { Button } from "@/components/ui/button";
import { getBookingsWithPropertiesByGuestId } from "@/db/queries";
import { getSession } from "@/lib/auth-server";

export async function GuestBookingsList() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const bookingsWithDetails = await getBookingsWithPropertiesByGuestId(
    session.user.id,
  );

  if (bookingsWithDetails.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          You don't have any bookings yet.
        </p>
        <Button asChild>
          <Link href="/">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookingsWithDetails.map(({ booking, property }) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          property={property}
          guestName={session.user.name}
        />
      ))}
    </div>
  );
}
