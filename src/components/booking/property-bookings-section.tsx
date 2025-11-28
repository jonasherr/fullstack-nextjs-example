import {
	getBookingsByPropertyId,
	getUserById,
	getPropertyById,
} from "@/db/queries";
import { PropertyBookingsList } from "./property-bookings-list";
import type { Booking, Property, User } from "@/lib/types";

interface PropertyBookingsSectionProps {
	propertyId: string;
}

export async function PropertyBookingsSection({
	propertyId,
}: PropertyBookingsSectionProps) {
	// Fetch all bookings for this property
	const bookings = await getBookingsByPropertyId(propertyId);

	// If no bookings, show empty state
	if (bookings.length === 0) {
		return (
			<div className="mt-12">
				<h2 className="text-2xl font-semibold mb-6">Manage Bookings</h2>
				<p className="text-muted-foreground">
					No bookings yet for this property.
				</p>
			</div>
		);
	}

	// Fetch property and guest details for all bookings in parallel
	const property = await getPropertyById(propertyId);
	if (!property) {
		return null;
	}

	const bookingsWithDetails = await Promise.all(
		bookings.map(async (booking) => {
			const guest = await getUserById(booking.guestId);
			return {
				booking,
				property,
				guest: guest as User,
			};
		}),
	);

	// Get current date for past booking check
	const now = new Date();
	now.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

	// Group bookings by status
	const pendingBookings = bookingsWithDetails
		.filter((item) => item.booking.status === "pending")
		.sort(
			(a, b) =>
				new Date(a.booking.checkInDate).getTime() -
				new Date(b.booking.checkInDate).getTime(),
		);

	const acceptedBookings = bookingsWithDetails
		.filter((item) => item.booking.status === "accepted")
		.sort(
			(a, b) =>
				new Date(a.booking.checkInDate).getTime() -
				new Date(b.booking.checkInDate).getTime(),
		);

	const pastBookings = bookingsWithDetails
		.filter((item) => {
			const checkOutDate = new Date(item.booking.checkOutDate);
			checkOutDate.setHours(0, 0, 0, 0);
			return (
				item.booking.status === "declined" ||
				item.booking.status === "canceled" ||
				checkOutDate < now
			);
		})
		.sort(
			(a, b) =>
				new Date(b.booking.checkInDate).getTime() -
				new Date(a.booking.checkInDate).getTime(),
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
