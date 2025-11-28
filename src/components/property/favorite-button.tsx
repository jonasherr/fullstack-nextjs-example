"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/app/actions/favorites";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
	propertyId: string;
	initialFavorited: boolean;
	userId?: string;
	size?: "default" | "sm" | "lg" | "icon";
	variant?: "default" | "ghost" | "outline";
	className?: string;
}

export function FavoriteButton({
	propertyId,
	initialFavorited,
	userId,
	size = "icon",
	variant = "ghost",
	className,
}: FavoriteButtonProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(
		initialFavorited,
	);

	async function handleToggle(e: React.MouseEvent) {
		// Prevent navigation if button is on a link/card
		e.preventDefault();
		e.stopPropagation();

		// Check if user is logged in
		if (!userId) {
			toast.error("Please log in to favorite properties");
			router.push("/login");
			return;
		}

		startTransition(async () => {
			// Optimistically update UI inside transition
			setOptimisticFavorited(!optimisticFavorited);

			const result = await toggleFavorite(propertyId);

			if (result.success) {
				toast.success(
					result.isFavorited
						? "Added to favorites"
						: "Removed from favorites",
				);
			} else {
				// Revert optimistic update on error
				setOptimisticFavorited(optimisticFavorited);
				toast.error(result.error || "Failed to update favorites");
			}
		});
	}

	return (
		<Button
			onClick={handleToggle}
			disabled={isPending}
			size={size}
			variant={variant}
			className={cn(
				"transition-colors",
				optimisticFavorited && "text-red-500 hover:text-red-600",
				className,
			)}
			aria-label={
				optimisticFavorited ? "Remove from favorites" : "Add to favorites"
			}
		>
			<Heart
				className={cn("h-5 w-5", optimisticFavorited && "fill-current")}
			/>
		</Button>
	);
}
