import { Bed, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/booking-form";
import { LoginToBookCard } from "@/components/booking/login-to-book-card";
import { PropertyBookingsSection } from "@/components/booking/property-bookings-section";
import { Header } from "@/components/navigation/header";
import { PropertyCarousel } from "@/components/property/property-carousel";
import { Separator } from "@/components/ui/separator";
import {
	getPropertyById,
	getAcceptedBookingsForProperty,
	isFavorited,
} from "@/db/queries";
import { FavoriteButton } from "@/components/property/favorite-button";
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
  const isHost = session?.user && property.hostId === session.user.id;

  // Fetch accepted bookings for availability checking
  const acceptedBookings = await getAcceptedBookingsForProperty(id);

  // Check if property is favorited by current user
  const favorited = session?.user
    ? await isFavorited(session.user.id, property.id)
    : false;

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
            {/* Property header with favorite button */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{property.name}</h1>
                <p className="text-muted-foreground flex items-center gap-1 mt-2">
                  <MapPin className="h-4 w-4" />
                  {property.address.street}, {property.address.city},{" "}
                  {property.address.state}
                </p>
              </div>

              {/* Favorite button - only show for non-hosts who are logged in */}
              {session?.user && !isHost && (
                <FavoriteButton
                  propertyId={property.id}
                  initialFavorited={favorited}
                  userId={session.user.id}
                  size="default"
                  variant="outline"
                />
              )}
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
                acceptedBookings={acceptedBookings}
              />
            ) : (
              <LoginToBookCard
                pricePerNight={property.pricePerNight}
                propertyId={property.id}
              />
            )}
          </div>
        </div>

        {isHost && (
          <>
            <Separator className="my-12" />
            <PropertyBookingsSection propertyId={property.id} />
          </>
        )}
      </main>
    </>
  );
}
