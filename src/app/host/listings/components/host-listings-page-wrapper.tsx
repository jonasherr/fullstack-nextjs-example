"use cache";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function HostListingsPageWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

      {children}
    </div>
  );
}
