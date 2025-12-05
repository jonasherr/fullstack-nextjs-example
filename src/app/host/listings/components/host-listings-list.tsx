import { HostPropertyCard } from "../[id]/components/host-property-card";
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {hostProperties.map((property, index) => (
        <HostPropertyCard
          key={property.id}
          property={property}
          shouldPrioritizeImage={index < 4}
        />
      ))}
    </div>
  );
}
