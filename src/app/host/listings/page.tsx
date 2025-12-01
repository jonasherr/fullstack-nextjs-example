import { Suspense } from "react";
import { HostListingsList } from "@/components/property/host-listings-list";
import { HostListingsSkeleton } from "@/components/property/host-listings-skeleton";
import { HostListingsPageWrapper } from "./components/host-listings-page-wrapper";

export default async function HostListingsPage() {
	return (
		<HostListingsPageWrapper>
			<Suspense fallback={<HostListingsSkeleton />}>
				<HostListingsList />
			</Suspense>
		</HostListingsPageWrapper>
	);
}
