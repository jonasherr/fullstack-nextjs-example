import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PropertyCarousel } from "@/app/properties/[id]/components/property-carousel";
import { PropertyDetails } from "@/app/properties/[id]/components/property-details";
import { getPropertyById } from "@/db/queries";
import { PropertyBookingsSection } from "./components/property-bookings-section";
import { PropertyBookingsSectionSkeleton } from "./components/property-bookings-section-skeleton";

export default async function HostPropertyPage({
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
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{property.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-2">
                <MapPin className="h-4 w-4" />
                {property.street}, {property.city}, {property.state}
              </p>
            </div>
          </div>

          <PropertyDetails property={property} />
        </div>
      </div>

      <Suspense fallback={<PropertyBookingsSectionSkeleton />}>
        <PropertyBookingsSection propertyId={property.id} />
      </Suspense>
    </>
  );
}
