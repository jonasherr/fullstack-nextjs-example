import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGrid } from "@/components/property/property-grid";
import { searchProperties } from "@/db/queries";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const location = (params.location as string) || undefined;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const guests = params.guests ? Number(params.guests) : undefined;

  const filteredProperties = await searchProperties({
    city: location,
    minPrice,
    maxPrice,
    minGuests: guests,
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
