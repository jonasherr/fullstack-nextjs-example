import { Plus } from "lucide-react";
import Link from "next/link";
import { PropertyGrid } from "@/components/property/property-grid";
import { Button } from "@/components/ui/button";
import { getPropertiesByHostId } from "@/db/queries";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function HostListingsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const hostProperties = await getPropertiesByHostId(session.user.id);

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
