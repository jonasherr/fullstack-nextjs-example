import { PropertyResultsSkeleton } from "./(marketing)/components/property-results-skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <PropertyResultsSkeleton />
    </div>
  );
}
