"use client";

import { format } from "date-fns";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cancelBooking } from "@/app/actions/bookings";
import { toast } from "sonner";
import type { Booking } from "@/lib/types";

interface CancelBookingDialogProps {
	booking: Booking;
	guestName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CancelBookingDialog({
	booking,
	guestName,
	open,
	onOpenChange,
}: CancelBookingDialogProps) {
	const [isProcessing, setIsProcessing] = useState(false);

	async function handleCancel() {
		setIsProcessing(true);
		try {
			const result = await cancelBooking(booking.id);
			if (result.success) {
				toast.success("Booking canceled successfully");
				onOpenChange(false);
			} else {
				toast.error(result.error || "Failed to cancel booking");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsProcessing(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cancel Booking</DialogTitle>
					<DialogDescription>
						Are you sure you want to cancel this booking?
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<div className="text-sm">
							<span className="font-medium">Guest:</span> {guestName}
						</div>
						<div className="text-sm">
							<span className="font-medium">Dates:</span>{" "}
							{format(new Date(booking.checkInDate), "MMM d")} -{" "}
							{format(new Date(booking.checkOutDate), "MMM d, yyyy")}
						</div>
						<div className="text-sm">
							<span className="font-medium">Total:</span> ${booking.totalPrice}
						</div>
					</div>

					<div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
						<AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
						<p className="text-sm text-destructive">
							This action cannot be undone. The guest will be notified.
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isProcessing}
					>
						Keep Booking
					</Button>
					<Button
						variant="destructive"
						onClick={handleCancel}
						disabled={isProcessing}
					>
						{isProcessing ? "Canceling..." : "Cancel Booking"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
