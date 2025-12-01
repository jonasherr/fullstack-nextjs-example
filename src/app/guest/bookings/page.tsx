import { Suspense } from "react";
import { GuestBookingsList } from "@/components/booking/guest-bookings-list";
import { GuestBookingsSkeleton } from "@/components/booking/guest-bookings-skeleton";
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
