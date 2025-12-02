import { Skeleton } from "@/components/ui/skeleton";

export function MobileNavSkeleton() {
	return (
		<div className="md:hidden">
			<Skeleton className="h-10 w-10 rounded-md" />
		</div>
	);
}
