import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/lib/auth-server";
import LogoutMenuItem from "./logout-menu-item";

export default async function MobileNav() {
  const session = await getSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session?.user ? (
          <>
            <DropdownMenuItem disabled>
              <div className="flex flex-col">
                <span className="font-medium">{session.user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {session.user.email}
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/host/listings">Host Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/guest/bookings">My Bookings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/guest/favorites">
                <Heart className="h-4 w-4 mr-2" />
                My Favorites
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutMenuItem />
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login">Log in</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
