import { PropertyForm } from "@/components/forms/property-form";

export default function NewPropertyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
      <PropertyForm />
    </div>
  );
}
