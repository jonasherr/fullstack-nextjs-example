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

export default async function Nav() {
  const session = await getSession();

  return (
    <nav className="hidden md:flex items-center gap-4">
      {session?.user ? (
        <>
          <Link href="/host/listings">
            <Button variant="ghost">Host Dashboard</Button>
          </Link>
          <Link href="/guest/bookings">
            <Button variant="ghost">My Bookings</Button>
          </Link>
          <Link href="/guest/favorites">
            <Button variant="ghost">My Favorites</Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">{session.user.name}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <div className="flex flex-col">
                  <span className="font-medium">{session.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutMenuItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Link href="/login">
          <Button>Log in</Button>
        </Link>
      )}
    </nav>
  );
}
