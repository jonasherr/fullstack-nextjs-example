import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div>
			<Skeleton className="h-9 w-64 mb-6" />
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="flex gap-4">
								<Skeleton className="h-24 w-32 rounded-md" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-6 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-4 w-2/3" />
								</div>
								<Skeleton className="h-8 w-24" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
