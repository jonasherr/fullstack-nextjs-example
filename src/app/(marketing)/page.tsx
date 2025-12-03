import { Suspense } from "react";
import { Hero } from "./components/hero";
import { PropertyFilters } from "./components/property-filters";
import { PropertyResults } from "./components/property-results";
import { PropertyResultsSkeleton } from "./components/property-results-skeleton";

export interface HomePageProps {
  searchParams: Promise<{
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    guests?: string;
    page?: string;
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
