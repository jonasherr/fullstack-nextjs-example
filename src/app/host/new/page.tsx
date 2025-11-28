import { PropertyForm } from "@/components/forms/property-form";
import { getUserByEmail } from "@/db/queries";

export default async function NewPropertyPage() {
  // TODO: Replace with actual session user ID in Phase 6
  const hostUser = await getUserByEmail("host@example.com");

  if (!hostUser) {
    return <div>Host not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
      <PropertyForm hostId={hostUser.id} />
    </div>
  );
}
