"use client";

import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBooking } from "@/app/actions/bookings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Booking } from "@/lib/types";
import { getDisabledDatesFromBookings } from "@/lib/date-utils";

interface BookingFormProps {
  propertyId: string;
  guestId?: string;
  pricePerNight: number;
  maxGuests: number;
  acceptedBookings: Booking[];
}

export function BookingForm({
  propertyId,
  guestId,
  pricePerNight,
  maxGuests,
  acceptedBookings,
}: BookingFormProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate disabled dates from accepted bookings (memoized for performance)
  const disabledDates = useMemo(() => {
    return getDisabledDatesFromBookings(acceptedBookings);
  }, [acceptedBookings]);

  // Enhanced disabled date checker - combines past dates and booked dates
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Disable booked dates
    return disabledDates.some(
      (disabledDate) =>
        disabledDate.toDateString() === date.toDateString()
    );
  };

  const nights =
    dateRange?.from && dateRange?.to
      ? Math.ceil(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
  const total = nights * pricePerNight;

  async function handleReserve() {
    if (!guestId) {
      toast.error("Please log in to complete your booking");
      router.push("/login");
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    setIsSubmitting(true);
    try {
      // Format dates in local timezone to avoid timezone shift issues
      const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formData = new FormData();
      formData.append("propertyId", propertyId);
      formData.append("guestId", guestId);
      formData.append("checkInDate", formatLocalDate(dateRange.from));
      formData.append("checkOutDate", formatLocalDate(dateRange.to));
      formData.append("totalPrice", total.toString());

      const result = await createBooking(formData);

      if (result.success) {
        toast.success("Booking request submitted successfully!");
        router.push("/guest/bookings");
      } else {
        toast.error(result.error || "Failed to create booking");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          <span className="text-2xl">${pricePerNight}</span>
          <span className="text-sm font-normal text-muted-foreground">
            / night
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Select dates</Label>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            disabled={isDateDisabled}
            className="rounded-md border"
          />
        </div>

        <div>
          <Label htmlFor="guests">Guests</Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger id="guests">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num} {num === 1 ? "guest" : "guests"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {nights > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span>
                ${pricePerNight} x {nights} nights
              </span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleReserve}
          className="w-full"
          disabled={!dateRange?.from || !dateRange?.to || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Reserve"}
        </Button>
      </CardContent>
    </Card>
  );
}
