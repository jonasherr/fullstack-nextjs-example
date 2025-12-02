import { Skeleton } from "@/components/ui/skeleton";
import { BookingFormSkeleton } from "@/components/booking/booking-form-skeleton";

export default function Loading() {
	return (
		<>
			{/* Image carousel skeleton */}
			<Skeleton className="aspect-[21/9] w-full rounded-lg" />

			<div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					{/* Header with favorite button */}
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<Skeleton className="h-9 w-3/4 mb-2" />
							<Skeleton className="h-5 w-1/2" />
						</div>
						<Skeleton className="h-10 w-10 rounded-full" />
					</div>

					{/* Property details */}
					<div className="space-y-4">
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-20 w-full" />
						<div className="grid grid-cols-2 gap-4">
							<Skeleton className="h-16 w-full" />
							<Skeleton className="h-16 w-full" />
						</div>
					</div>
				</div>

				<BookingFormSkeleton />
			</div>
		</>
	);
}
