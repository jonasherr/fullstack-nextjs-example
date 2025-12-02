"use client";

import { LogOut } from "lucide-react";
import { refresh } from "next/cache";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function LogoutMenuItem() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    toast.success("Logged out successfully");
    refresh();
    router.push("/");
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Log out
    </DropdownMenuItem>
  );
}
