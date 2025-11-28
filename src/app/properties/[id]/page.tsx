import { Bed, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/booking-form";
import { LoginToBookCard } from "@/components/booking/login-to-book-card";
import { Header } from "@/components/navigation/header";
import { PropertyCarousel } from "@/components/property/property-carousel";
import { Separator } from "@/components/ui/separator";
import { getPropertyById } from "@/db/queries";
import { getSession } from "@/lib/auth-server";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const session = await getSession();

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PropertyCarousel
          images={property.images}
          propertyName={property.name}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{property.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-2">
                <MapPin className="h-4 w-4" />
                {property.address.street}, {property.address.city},{" "}
                {property.address.state}
              </p>
            </div>

            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{property.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                <span>{property.numBedrooms} bedrooms</span>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-2">About this place</h2>
              <p className="text-muted-foreground">{property.description}</p>
            </div>
          </div>

          <div>
            {session?.user ? (
              <BookingForm
                propertyId={property.id}
                guestId={session.user.id}
                pricePerNight={property.pricePerNight}
                maxGuests={property.maxGuests}
              />
            ) : (
              <LoginToBookCard
                pricePerNight={property.pricePerNight}
                propertyId={property.id}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
