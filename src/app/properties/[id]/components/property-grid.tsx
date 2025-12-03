import type { Property } from "@/lib/types";
import { PropertyCard } from "./property-card";

interface PropertyGridProps {
  properties: Property[];
  userId?: string;
  favoritedIds?: Set<number>;
}

export function PropertyGrid({
  properties,
  userId,
  favoritedIds,
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No properties found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property, index) => (
        <PropertyCard
          key={property.id}
          property={property}
          userId={userId}
          isFavorited={favoritedIds?.has(property.id) ?? false}
          shouldPrioritizeImage={index < 4}
        />
      ))}
    </div>
  );
}
