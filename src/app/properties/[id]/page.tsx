import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingFormSkeleton } from "@/components/booking/booking-form-skeleton";
import { BookingFormWrapper } from "@/components/booking/booking-form-wrapper";
import { PropertyBookingsSection } from "@/components/booking/property-bookings-section";
import { FavoriteButtonSkeleton } from "@/components/property/favorite-button-skeleton";
import { FavoriteButtonWrapper } from "@/components/property/favorite-button-wrapper";
import { PropertyCarousel } from "@/components/property/property-carousel";
import { PropertyDetails } from "@/components/property/property-details";
import { db } from "@/db";
import { getPropertyById } from "@/db/queries";
import { properties } from "@/db/schema";

export async function generateStaticParams() {
  const mostPopularProperties = await db
    .select({ id: properties.id })
    .from(properties)
    .orderBy(properties.createdAt)
    .limit(5);
  return mostPopularProperties.map((p) => ({ id: String(p.id) }));
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idAsString } = await params;
  const id = Number(idAsString);

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <>
      <PropertyCarousel images={property.images} propertyName={property.name} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Property header with favorite button */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{property.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-2">
                <MapPin className="h-4 w-4" />
                {property.street}, {property.city}, {property.state}
              </p>
            </div>

            {/* Favorite button - streams in dynamically */}
            <Suspense fallback={<FavoriteButtonSkeleton />}>
              <FavoriteButtonWrapper
                propertyId={property.id}
                hostId={property.hostId}
              />
            </Suspense>
          </div>

          <PropertyDetails property={property} />
        </div>

        <Suspense fallback={<BookingFormSkeleton />}>
          <BookingFormWrapper
            propertyId={idAsString}
            pricePerNight={Number(property.pricePerNight)}
            maxGuests={property.maxGuests}
          />
        </Suspense>
      </div>

      <Suspense>
        <PropertyBookingsSection propertyId={property.id} />
      </Suspense>
    </>
  );
}
