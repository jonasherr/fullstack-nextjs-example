import { FavoriteButton } from "@/components/property/favorite-button";
import { isFavorited } from "@/db/queries";
import { getSession } from "@/lib/auth-server";

interface FavoriteButtonWrapperProps {
  propertyId: number;
  hostId: string;
}

export async function FavoriteButtonWrapper({
  propertyId,
  hostId,
}: FavoriteButtonWrapperProps) {
  const session = await getSession();

  // Don't show if not logged in or if user is the host
  if (!session?.user || session.user.id === hostId) {
    return null;
  }

  const favorited = await isFavorited(session.user.id, propertyId);

  return (
    <FavoriteButton
      propertyId={propertyId}
      initialFavorited={favorited}
      userId={session.user.id}
      size="default"
      variant="outline"
    />
  );
}
