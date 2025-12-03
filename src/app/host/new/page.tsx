import { PropertyForm } from "./components/property-form";
import { requireAuth } from "@/lib/auth-server";

export default async function NewPropertyPage() {
  const session = await requireAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
      <PropertyForm hostId={session.user.id} />
    </div>
  );
}
