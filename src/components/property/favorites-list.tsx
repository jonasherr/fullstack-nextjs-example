import { Heart } from "lucide-react";
import Link from "next/link";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { getFavoritesByUserId } from "@/db/queries";
import { requireAuth } from "@/lib/auth-server";

export async function FavoritesList() {
	const session = await requireAuth();

	const favorites = await getFavoritesByUserId(session.user.id);

	if (favorites.length === 0) {
		return (
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
		);
	}

	return (
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
	);
}
