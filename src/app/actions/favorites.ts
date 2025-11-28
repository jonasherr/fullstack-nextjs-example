"use server";

import { db } from "@/db";
import { favorites } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { getPropertyById } from "@/db/queries";

export async function toggleFavorite(propertyId: string) {
	try {
		// 1. Check authentication
		const session = await getSession();
		if (!session?.user) {
			return {
				success: false,
				error: "You must be logged in to favorite properties",
			};
		}

		const userId = session.user.id;
		const propertyIdNum = Number.parseInt(propertyId);

		// 2. Verify property exists
		const property = await getPropertyById(propertyId);
		if (!property) {
			return {
				success: false,
				error: "Property not found",
			};
		}

		// 3. Check if already favorited
		const existing = await db
			.select()
			.from(favorites)
			.where(
				and(
					eq(favorites.userId, userId),
					eq(favorites.propertyId, propertyIdNum),
				),
			)
			.limit(1);

		const isFavorited = existing.length > 0;

		// 4. Toggle favorite
		if (isFavorited) {
			// Remove from favorites
			await db.delete(favorites).where(
				and(
					eq(favorites.userId, userId),
					eq(favorites.propertyId, propertyIdNum),
				),
			);
		} else {
			// Add to favorites
			await db.insert(favorites).values({
				userId,
				propertyId: propertyIdNum,
			});
		}

		// 5. Revalidate relevant pages
		revalidatePath("/guest/favorites");
		revalidatePath("/properties");
		revalidatePath(`/properties/${propertyId}`);

		return {
			success: true,
			isFavorited: !isFavorited, // Return new state
		};
	} catch (error) {
		console.error("Error toggling favorite:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to toggle favorite",
		};
	}
}
