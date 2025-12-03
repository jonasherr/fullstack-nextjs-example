import { Suspense } from "react";
import { FavoritesList } from "./components/favorites-list";
import { FavoritesSkeleton } from "./components/favorites-skeleton";
import { FavoritesPageWrapper } from "./components/favorites-page-wrapper";

export default async function FavoritesPage() {
  return (
    <FavoritesPageWrapper>
      <Suspense fallback={<FavoritesSkeleton />}>
        <FavoritesList />
      </Suspense>
    </FavoritesPageWrapper>
  );
}
