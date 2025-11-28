import { Bed, MapPin, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Property } from "@/lib/types";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group cursor-pointer overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="truncate font-semibold">{property.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {property.address.city}, {property.address.state}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
              <span className="text-sm">5.0</span>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-semibold">${property.pricePerNight}</span>
            <span className="text-sm text-muted-foreground">/ night</span>
          </div>

          <div className="mt-2 flex gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{property.maxGuests} guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.numBedrooms} beds</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
