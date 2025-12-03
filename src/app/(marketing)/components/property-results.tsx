import { HomePageProps } from "@/app/(marketing)/page";
import { PropertyGrid } from "@/app/properties/[id]/components/property-grid";
import { PropertyPagination } from "./property-pagination";
import { getFavoritesByUserId, searchProperties } from "@/db/queries";
import { getSession } from "@/lib/auth-server";

async function getUserWithFavorites() {
  "use cache: private";
  const session = await getSession();
  const user = session?.user;

  const favoriteProperties = user
    ? await getFavoritesByUserId(session.user.id)
    : [];

  return { user, favoriteProperties };
}

export async function PropertyResults({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { location, minPrice, maxPrice, guests, page } = params;

  const currentPage = page ? parseInt(page, 10) : 1;

  // Fetch properties and favorites in parallel
  const [
    { properties: filteredProperties, totalCount, totalPages },
    { user, favoriteProperties },
  ] = await Promise.all([
    searchProperties({
      city: location,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minGuests: guests ? Number(guests) : undefined,
      page: currentPage,
      pageSize: 8,
    }),
    getUserWithFavorites(),
  ]);

  // Create Set for O(1) lookup
  const favoritedIds = new Set(
    favoriteProperties.map((fav) => fav.property.id),
  );

  const hasFilters = location || minPrice || maxPrice || guests;

  // Build base URL with current filters (excluding page)
  const buildBaseUrl = () => {
    const urlParams = new URLSearchParams();
    if (location) urlParams.set("location", location);
    if (minPrice) urlParams.set("minPrice", minPrice);
    if (maxPrice) urlParams.set("maxPrice", maxPrice);
    if (guests) urlParams.set("guests", guests);

    const queryString = urlParams.toString();
    return queryString ? `/?${queryString}` : "/";
  };

  const baseUrl = buildBaseUrl();

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {hasFilters
            ? `${totalCount} ${totalCount === 1 ? "stay" : "stays"} found`
            : "Explore stays"}
        </h2>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No properties found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <PropertyGrid
            properties={filteredProperties}
            userId={user?.id}
            favoritedIds={favoritedIds}
          />

          {totalPages > 1 && (
            <div className="mt-8">
              <PropertyPagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={baseUrl}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
