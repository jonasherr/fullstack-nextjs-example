import { Skeleton } from "@/components/ui/skeleton";

export function NavSkeleton() {
  return (
    <nav className="hidden md:flex items-center gap-4">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-28" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-24" />
    </nav>
  );
}
