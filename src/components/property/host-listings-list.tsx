import { redirect } from "next/navigation";
import { PropertyGrid } from "@/components/property/property-grid";
import { getPropertiesByHostId } from "@/db/queries";
import { getSession } from "@/lib/auth-server";

export async function HostListingsList() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const hostProperties = await getPropertiesByHostId(session.user.id);

	if (hostProperties.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">
					Create your first listing to get started!
				</p>
			</div>
		);
	}

	return <PropertyGrid properties={hostProperties} />;
}
