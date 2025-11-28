import { Heart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { getFavoritesByUserId } from "@/db/queries";
import { getSession } from "@/lib/auth-server";

export default async function FavoritesPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const favorites = await getFavoritesByUserId(session.user.id);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <p className="text-muted-foreground mt-2">
          Properties you've saved for later
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-4">
            Start exploring properties and save your favorites!
          </p>
          <Button asChild>
            <Link href="/">Browse Properties</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(({ property }) => (
            <PropertyCard
              key={property.id}
              property={property}
              userId={session.user.id}
              isFavorited={true}
            />
          ))}
        </div>
      )}
    </>
  );
}
