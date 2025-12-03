"use cache";

import { Bed, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Property } from "@/lib/types";

interface PropertyDetailsProps {
  property: Property;
}

export async function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="space-y-6">
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
  );
}
