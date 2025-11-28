import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyResults } from "@/components/property/property-results";
import { PropertyResultsSkeleton } from "@/components/property/property-results-skeleton";

export interface HomePageProps {
  searchParams: Promise<{
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    guests?: string;
  }>;
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <div className="space-y-8">
      <Hero />

      <PropertyFilters />

      <Suspense fallback={<PropertyResultsSkeleton />}>
        <PropertyResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
