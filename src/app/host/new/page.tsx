import { PropertyForm } from "@/components/forms/property-form";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
      <PropertyForm hostId={session.user.id} />
    </div>
  );
}
