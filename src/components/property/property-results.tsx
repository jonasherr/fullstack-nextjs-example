import { HomePageProps } from "@/app/(marketing)/page";
import { PropertyGrid } from "@/components/property/property-grid";
import { getFavoritesByUserId, searchProperties } from "@/db/queries";
import { getSession } from "@/lib/auth-server";

async function getUserWithFavorites() {
  const session = await getSession();
  const user = session?.user;

  const favoriteProperties = user
    ? await getFavoritesByUserId(session.user.id)
    : [];

  return { user, favoriteProperties };
}

export async function PropertyResults({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { location, minPrice, maxPrice, guests } = params;

  // Fetch properties and favorites in parallel
  const [filteredProperties, { user, favoriteProperties }] = await Promise.all([
    searchProperties({
      city: location,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minGuests: guests ? Number(guests) : undefined,
    }),
    getUserWithFavorites(),
  ]);

  // Create Set for O(1) lookup
  const favoritedIds = new Set(
    favoriteProperties.map((fav) => fav.property.id),
  );

  const hasFilters = location || minPrice || maxPrice || guests;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {hasFilters
            ? `${filteredProperties.length} ${filteredProperties.length === 1 ? "stay" : "stays"} found`
            : "Explore stays"}
        </h2>
      </div>
      <PropertyGrid
        properties={filteredProperties}
        userId={user?.id}
        favoritedIds={favoritedIds}
      />
    </section>
  );
}
