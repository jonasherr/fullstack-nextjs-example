import { Plus } from "lucide-react";
import Link from "next/link";
import { PropertyGrid } from "@/components/property/property-grid";
import { Button } from "@/components/ui/button";
import { getPropertiesByHostId, getUserByEmail } from "@/db/queries";

export default async function HostListingsPage() {
  // TODO: Replace with actual session user ID in Phase 6
  const hostUser = await getUserByEmail("host@example.com");
  const hostProperties = hostUser
    ? await getPropertiesByHostId(hostUser.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link href="/host/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Listing
          </Button>
        </Link>
      </div>

      {hostProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Create your first listing to get started!
          </p>
        </div>
      ) : (
        <PropertyGrid properties={hostProperties} />
      )}
    </div>
  );
}
