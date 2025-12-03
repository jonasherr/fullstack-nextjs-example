import { PropertyGrid } from "@/app/properties/[id]/components/property-grid";
import { getPropertiesByHostId } from "@/db/queries";
import { requireAuth } from "@/lib/auth-server";

export async function HostListingsList() {
  const session = await requireAuth();

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
