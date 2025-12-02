import Link from "next/link";
import { Suspense } from "react";
import MobileNav from "./mobile-nav";
import { MobileNavSkeleton } from "./mobile-nav-skeleton";
import Nav from "./nav";
import { NavSkeleton } from "./nav-skeleton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          BeeBnB
        </Link>

        <Suspense fallback={<NavSkeleton />}>
          <Nav />
        </Suspense>

        <Suspense fallback={<MobileNavSkeleton />}>
          <MobileNav />
        </Suspense>
      </div>
    </header>
  );
}
