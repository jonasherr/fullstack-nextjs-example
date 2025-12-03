import { Suspense } from "react";
import { GuestBookingsList } from "./components/guest-bookings-list";
import { GuestBookingsSkeleton } from "./components/guest-bookings-skeleton";
import { GuestBookingsPageWrapper } from "./components/guest-bookings-page-wrapper";

export default async function GuestBookingsPage() {
  return (
    <GuestBookingsPageWrapper>
      <Suspense fallback={<GuestBookingsSkeleton />}>
        <GuestBookingsList />
      </Suspense>
    </GuestBookingsPageWrapper>
  );
}
