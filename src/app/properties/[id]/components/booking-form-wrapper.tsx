import { BookingForm } from "./booking-form";
import { LoginToBookCard } from "./login-to-book-card";
import { getAcceptedBookingsForProperty } from "@/db/queries";
import { getSession } from "@/lib/auth-server";

interface BookingFormWrapperProps {
  propertyId: string;
  pricePerNight: number;
  maxGuests: number;
}

export async function BookingFormWrapper({
  propertyId,
  pricePerNight,
  maxGuests,
}: BookingFormWrapperProps) {
  const session = await getSession();
  const acceptedBookings = await getAcceptedBookingsForProperty(propertyId);

  if (!session?.user) {
    return <LoginToBookCard pricePerNight={pricePerNight} />;
  }

  return (
    <BookingForm
      propertyId={propertyId}
      guestId={session.user.id}
      pricePerNight={pricePerNight}
      maxGuests={maxGuests}
      acceptedBookings={acceptedBookings}
    />
  );
}
