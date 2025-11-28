import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGrid } from "@/components/property/property-grid";
import { mockProperties } from "@/lib/mock-data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const location = (params.location as string) || "";
  const minPrice = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : Infinity;
  const guests = params.guests ? Number(params.guests) : 1;

  const filteredProperties = mockProperties.filter((property) => {
    const matchesLocation =
      !location ||
      property.address.city.toLowerCase().includes(location.toLowerCase()) ||
      property.address.state.toLowerCase().includes(location.toLowerCase());
    const matchesPrice =
      property.pricePerNight >= minPrice && property.pricePerNight <= maxPrice;
    const matchesGuests = property.maxGuests >= guests;
    return matchesLocation && matchesPrice && matchesGuests;
  });

  return (
    <div className="space-y-8">
      <PropertyFilters />

      <div>
        <p className="text-muted-foreground mb-4">
          {filteredProperties.length} properties found
        </p>
        <PropertyGrid properties={filteredProperties} />
      </div>
    </div>
  );
}
