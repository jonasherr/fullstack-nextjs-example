"use client";

import { format } from "date-fns";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { acceptBooking, declineBooking } from "@/app/actions/bookings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Booking, Property } from "@/lib/types";
import { CancelBookingDialog } from "./cancel-booking-dialog";

interface BookingCardProps {
  booking: Pick<
    Booking,
    "id" | "checkInDate" | "checkOutDate" | "totalPrice" | "status"
  >;
  property: Pick<Property, "id" | "images" | "name">;
  guestName: string;
  showActions?: boolean;
  showCancelAction?: boolean;
}

export function BookingCard({
  booking,
  property,
  guestName,
  showActions,
  showCancelAction,
}: BookingCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const statusColors = {
    pending: "bg-yellow-500",
    accepted: "bg-green-500",
    declined: "bg-red-500",
    canceled: "bg-gray-500",
  };

  async function handleAccept() {
    setIsProcessing(true);
    try {
      const result = await acceptBooking(booking.id);
      if (result.success) {
        toast.success("Booking accepted successfully!");
      } else {
        toast.error(result.error || "Failed to accept booking");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDecline() {
    setIsProcessing(true);
    try {
      const result = await declineBooking(booking.id);
      if (result.success) {
        toast.success("Booking declined");
      } else {
        toast.error(result.error || "Failed to decline booking");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-32 h-32 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={property.images[0]}
              alt={property.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{property.name}</h3>
                <p className="text-sm text-muted-foreground">{guestName}</p>
              </div>
              <Badge className={statusColors[booking.status]}>
                {booking.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(booking.checkInDate), "MMM d")} -{" "}
                {format(new Date(booking.checkOutDate), "MMM d, yyyy")}
              </span>
            </div>

            <p className="font-semibold">${booking.totalPrice}</p>

            {showActions && booking.status === "pending" && (
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleAccept}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Accept"}
                </Button>
                <Button
                  onClick={handleDecline}
                  size="sm"
                  variant="destructive"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Decline"}
                </Button>
              </div>
            )}

            {showCancelAction && (
              <div className="pt-2">
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                >
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CancelBookingDialog
        booking={booking}
        guestName={guestName}
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
      />
    </Card>
  );
}
