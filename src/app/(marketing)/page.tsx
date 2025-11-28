import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGrid } from "@/components/property/property-grid";
import { searchProperties } from "@/db/queries";

interface HomePageProps {
  searchParams: Promise<{
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    guests?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { location, minPrice, maxPrice, guests } = params;

  // Fetch properties from database with filters
  const filteredProperties = await searchProperties({
    city: location,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minGuests: guests ? Number(guests) : undefined,
  });

  const hasFilters = location || minPrice || maxPrice || guests;

  return (
    <div className="space-y-8">
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg">
        <div className="text-center z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Find your next stay
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover unique homes and experiences
          </p>
        </div>
      </section>

      <PropertyFilters />

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {hasFilters
              ? `${filteredProperties.length} ${filteredProperties.length === 1 ? "stay" : "stays"} found`
              : "Explore stays"}
          </h2>
        </div>
        <PropertyGrid properties={filteredProperties} />
      </section>
    </div>
  );
}
