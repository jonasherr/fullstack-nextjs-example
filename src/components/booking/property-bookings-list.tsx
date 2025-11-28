import { Badge } from "@/components/ui/badge";
import { BookingCard } from "./booking-card";
import type { Booking, Property, User } from "@/lib/types";

interface PropertyBookingsListProps {
	bookings: Array<{ booking: Booking; property: Property; guest: User }>;
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
				{bookings.map(({ booking, property, guest }) => (
					<BookingCard
						key={booking.id}
						booking={booking}
						property={property}
						guestName={guest.name}
						showActions={booking.status === "pending"}
						showCancelAction={showCancelAction}
					/>
				))}
			</div>
		</div>
	);
}
